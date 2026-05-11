from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional
from app.database import get_db
from app.models import Article
from app.schemas import ArticleOut, ArticleListResponse, StatsResponse

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("", response_model=ArticleListResponse)
async def list_articles(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("published_at"),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Article)

    if search:
        term = f"%{search}%"
        stmt = stmt.where(
            or_(
                Article.title.ilike(term),
                Article.description.ilike(term),
                Article.ai_summary.ilike(term),
            )
        )
    if category and category != "all":
        stmt = stmt.where(Article.category == category)
    if sentiment and sentiment != "all":
        stmt = stmt.where(Article.ai_sentiment == sentiment)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar() or 0

    sort_col = getattr(Article, sort_by, Article.published_at)
    stmt = stmt.order_by(sort_col.desc().nullslast())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    articles = result.scalars().all()

    return ArticleListResponse(
        articles=[ArticleOut.model_validate(a) for a in articles],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )


@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    total = (await db.execute(select(func.count(Article.id)))).scalar() or 0
    processed = (
        await db.execute(select(func.count(Article.id)).where(Article.ai_processed == True))
    ).scalar() or 0

    sentiment_rows = await db.execute(
        select(Article.ai_sentiment, func.count(Article.id))
        .where(Article.ai_sentiment != None)
        .group_by(Article.ai_sentiment)
    )
    sentiment_breakdown = {row[0]: row[1] for row in sentiment_rows}

    category_rows = await db.execute(
        select(Article.category, func.count(Article.id))
        .where(Article.category != None)
        .group_by(Article.category)
    )
    category_breakdown = {row[0]: row[1] for row in category_rows}

    latest = (
        await db.execute(select(func.max(Article.created_at)))
    ).scalar()

    return StatsResponse(
        total_articles=total,
        ai_processed=processed,
        sentiment_breakdown=sentiment_breakdown,
        category_breakdown=category_breakdown,
        latest_fetch=latest.isoformat() if latest else None,
    )


@router.get("/{article_id}", response_model=ArticleOut)
async def get_article(article_id: str, db: AsyncSession = Depends(get_db)):
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return ArticleOut.model_validate(article)
