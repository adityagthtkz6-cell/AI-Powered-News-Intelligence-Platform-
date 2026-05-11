import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.config import get_settings
from app.database import AsyncSessionLocal
from app.pipeline import run_pipeline
from app.ai_processor import process_unanalyzed_articles

logger = logging.getLogger(__name__)
settings = get_settings()

scheduler = AsyncIOScheduler()


async def scheduled_pipeline():
    logger.info("Scheduled pipeline triggered")
    try:
        async with AsyncSessionLocal() as db:
            new_articles = await run_pipeline(db, max_articles=settings.max_articles_per_fetch)
        async with AsyncSessionLocal() as db:
            processed = await process_unanalyzed_articles(db, batch_size=max(new_articles, 10))
        logger.info(f"Scheduled pipeline done: {new_articles} new, {processed} AI-processed")
    except Exception as e:
        logger.error(f"Scheduled pipeline error: {e}")


def start_scheduler():
    scheduler.add_job(
        scheduled_pipeline,
        "interval",
        minutes=settings.fetch_interval_minutes,
        id="news_pipeline",
        replace_existing=True,
    )
    scheduler.start()
    logger.info(f"Scheduler started — pipeline runs every {settings.fetch_interval_minutes} minutes")


def stop_scheduler():
    scheduler.shutdown(wait=False)
