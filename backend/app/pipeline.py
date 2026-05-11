import asyncio
import httpx
import logging
from datetime import datetime
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import get_settings
from app.models import Article

logger = logging.getLogger(__name__)
settings = get_settings()

NEWSDATA_BASE_URL = "https://newsdata.io/api/1/news"


def _parse_date(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(date_str, fmt)
        except (ValueError, TypeError):
            continue
    return None


def _clean_text(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    return " ".join(text.split()).strip()


def _validate_article(raw: dict) -> bool:
    return bool(raw.get("article_id") and raw.get("title") and raw.get("title").strip())


def _parse_article(raw: dict) -> dict:
    return {
        "id": raw["article_id"],
        "title": _clean_text(raw.get("title")),
        "description": _clean_text(raw.get("description")),
        "content": _clean_text(raw.get("content")),
        "source_id": raw.get("source_id"),
        "source_name": raw.get("source_name") or raw.get("source_id"),
        "author": _clean_text(", ".join(raw["creator"]) if raw.get("creator") else None),
        "url": raw.get("link"),
        "image_url": raw.get("image_url"),
        "category": (raw.get("category") or ["general"])[0] if raw.get("category") else "general",
        "language": raw.get("language"),
        "country": raw.get("country"),
        "published_at": _parse_date(raw.get("pubDate")),
    }


async def fetch_news_page(client: httpx.AsyncClient, category: str, page: Optional[str] = None) -> tuple[list[dict], Optional[str]]:
    params = {
        "apikey": settings.newsdata_api_key,
        "category": category,
        "language": settings.news_language,
        "size": 10,
    }
    if page:
        params["page"] = page

    try:
        resp = await client.get(NEWSDATA_BASE_URL, params=params, timeout=30.0)
        resp.raise_for_status()
        data = resp.json()
        if data.get("status") != "success":
            logger.error(f"NewsData API error: {data}")
            return [], None
        return data.get("results", []), data.get("nextPage")
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error fetching news [{category}]: {e.response.status_code} - {e.response.text}")
        return [], None
    except Exception as e:
        logger.error(f"Error fetching news [{category}]: {e}")
        return [], None


async def _fetch_category(client: httpx.AsyncClient, category: str, limit: int) -> list[dict]:
    fetched = []
    next_page = None
    seen_ids: set[str] = set()

    while len(fetched) < limit:
        raw_articles, next_page = await fetch_news_page(client, category, next_page)
        if not raw_articles:
            break
        for raw in raw_articles:
            if len(fetched) >= limit:
                break
            if not _validate_article(raw):
                continue
            article_id = raw["article_id"]
            if article_id in seen_ids:
                continue
            seen_ids.add(article_id)
            fetched.append(_parse_article(raw))
        if not next_page:
            break

    return fetched


async def run_pipeline(db: AsyncSession, max_articles: int = 50):
    categories = [c.strip() for c in settings.news_categories.split(",")]
    per_category = max(1, max_articles // len(categories))

    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(
            *[_fetch_category(client, cat, per_category) for cat in categories],
            return_exceptions=True,
        )

    all_parsed: list[dict] = []
    seen_ids: set[str] = set()
    for r in results:
        if isinstance(r, Exception):
            logger.error(f"Category fetch error: {r}")
            continue
        for parsed in r:
            if parsed["id"] not in seen_ids:
                seen_ids.add(parsed["id"])
                all_parsed.append(parsed)

    total_new = 0
    for parsed in all_parsed:
        existing = await db.get(Article, parsed["id"])
        if existing:
            continue
        db.add(Article(**parsed))
        total_new += 1

    if total_new:
        await db.commit()

    logger.info(f"Pipeline complete: {total_new} new articles ingested")
    return total_new
