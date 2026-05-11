import asyncio
import json
import logging
from datetime import datetime
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import get_settings
from app.models import Article

logger = logging.getLogger(__name__)
settings = get_settings()

_client: AsyncOpenAI | None = None


def get_openai_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


SYSTEM_PROMPT = """You are a news intelligence analyst. Given a news article, respond with a JSON object containing exactly these fields:
- "summary": A 1-2 sentence factual summary of the article.
- "sentiment": One of exactly "positive", "negative", or "neutral".
- "sentiment_score": A float from -1.0 (most negative) to 1.0 (most positive).
- "key_insights": An array of 3-5 concise, actionable insights or key takeaways from the article.

Respond ONLY with valid JSON. No markdown, no extra text."""


async def analyze_article(title: str, description: str | None, content: str | None) -> dict | None:
    text_parts = [f"Title: {title}"]
    if description:
        text_parts.append(f"Description: {description}")
    if content:
        text_parts.append(f"Content: {content[:2000]}")
    article_text = "\n\n".join(text_parts)

    try:
        client = get_openai_client()
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": article_text},
            ],
            temperature=0.3,
            max_tokens=600,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        result = json.loads(raw)
        return {
            "summary": str(result.get("summary", "")).strip(),
            "sentiment": str(result.get("sentiment", "neutral")).lower(),
            "sentiment_score": float(result.get("sentiment_score", 0.0)),
            "key_insights": list(result.get("key_insights", [])),
        }
    except Exception as e:
        logger.error(f"AI analysis failed for article '{title[:50]}': {e}")
        return None


async def process_unanalyzed_articles(db: AsyncSession, batch_size: int = 20):
    stmt = (
        select(Article)
        .where(Article.ai_processed == False)
        .limit(batch_size)
    )
    result = await db.execute(stmt)
    articles = result.scalars().all()

    if not articles:
        return 0

    ai_results = await asyncio.gather(
        *[analyze_article(a.title, a.description, a.content) for a in articles],
        return_exceptions=False,
    )

    processed = 0
    now = datetime.utcnow()
    for article, ai_result in zip(articles, ai_results):
        if ai_result:
            article.ai_summary = ai_result["summary"]
            article.ai_sentiment = ai_result["sentiment"]
            article.ai_sentiment_score = ai_result["sentiment_score"]
            article.ai_key_insights = ai_result["key_insights"]
            article.ai_processed = True
            article.ai_processed_at = now
            processed += 1
        else:
            article.ai_processed = True
            article.ai_processed_at = now

    await db.commit()
    logger.info(f"AI processing complete: {processed}/{len(articles)} articles analyzed")
    return processed
