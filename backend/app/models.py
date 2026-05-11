from sqlalchemy import Column, String, Text, DateTime, Float, Integer, JSON, Boolean
from sqlalchemy.sql import func
from app.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    source_id = Column(String, nullable=True)
    source_name = Column(String, nullable=True)
    author = Column(String, nullable=True)
    url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    language = Column(String, nullable=True)
    country = Column(JSON, nullable=True)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    ai_summary = Column(Text, nullable=True)
    ai_sentiment = Column(String, nullable=True)
    ai_sentiment_score = Column(Float, nullable=True)
    ai_key_insights = Column(JSON, nullable=True)
    ai_processed = Column(Boolean, default=False)
    ai_processed_at = Column(DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "content": self.content,
            "source_id": self.source_id,
            "source_name": self.source_name,
            "author": self.author,
            "url": self.url,
            "image_url": self.image_url,
            "category": self.category,
            "language": self.language,
            "country": self.country,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "ai_summary": self.ai_summary,
            "ai_sentiment": self.ai_sentiment,
            "ai_sentiment_score": self.ai_sentiment_score,
            "ai_key_insights": self.ai_key_insights,
            "ai_processed": self.ai_processed,
        }
