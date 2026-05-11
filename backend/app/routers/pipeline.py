from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db, AsyncSessionLocal
from app.pipeline import run_pipeline
from app.ai_processor import process_unanalyzed_articles
from app.schemas import PipelineResponse
from app.config import get_settings

router = APIRouter(prefix="/pipeline", tags=["pipeline"])
settings = get_settings()


async def _run_full_pipeline():
    async with AsyncSessionLocal() as db:
        new_articles = await run_pipeline(db, max_articles=settings.max_articles_per_fetch)
    async with AsyncSessionLocal() as db:
        processed = await process_unanalyzed_articles(db, batch_size=new_articles + 5)
    return new_articles, processed


@router.post("/trigger", response_model=PipelineResponse)
async def trigger_pipeline(background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    new_articles = await run_pipeline(db, max_articles=settings.max_articles_per_fetch)
    async with AsyncSessionLocal() as ai_db:
        processed = await process_unanalyzed_articles(ai_db, batch_size=max(new_articles + 20, 20))
    return PipelineResponse(
        message="Pipeline completed successfully",
        new_articles=new_articles,
        ai_processed=processed,
    )


@router.post("/ai-process", response_model=dict)
async def trigger_ai_processing(batch_size: int = 10, db: AsyncSession = Depends(get_db)):
    processed = await process_unanalyzed_articles(db, batch_size=batch_size)
    return {"message": f"AI processed {processed} articles", "processed": processed}
