import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.scheduler import start_scheduler, stop_scheduler
from app.routers import articles, pipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up News Intelligence Platform...")
    await init_db()
    start_scheduler()
    yield
    stop_scheduler()
    logger.info("Shutting down...")


app = FastAPI(
    title="AI-Powered News Intelligence Platform",
    description="Real-time news aggregation with AI-powered analysis",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(articles.router, prefix="/api")
app.include_router(pipeline.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "News Intelligence Platform"}
