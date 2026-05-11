from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ArticleOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    source_name: Optional[str] = None
    author: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = None
    country: Optional[Any] = None
    published_at: Optional[datetime] = None
    ai_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_sentiment_score: Optional[float] = None
    ai_key_insights: Optional[List[str]] = None
    ai_processed: bool = False

    model_config = {"from_attributes": True}


class ArticleListResponse(BaseModel):
    articles: List[ArticleOut]
    total: int
    page: int
    page_size: int
    total_pages: int


class StatsResponse(BaseModel):
    total_articles: int
    ai_processed: int
    sentiment_breakdown: dict
    category_breakdown: dict
    latest_fetch: Optional[str] = None


class PipelineResponse(BaseModel):
    message: str
    new_articles: int
    ai_processed: int
