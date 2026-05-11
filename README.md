# NewsIQ — AI-Powered News Intelligence Platform

Real-time news aggregation with AI-generated summaries, sentiment analysis, and key insights.

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  NewsData.io API    │────▶│  FastAPI Backend      │────▶│  React Frontend │
│  (news source)      │     │  + SQLite DB          │     │  (Vite + Tailwind)│
└─────────────────────┘     │  + OpenAI GPT-4o-mini │     └─────────────────┘
                            └──────────────────────┘
```

**Tech Stack:**
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy (async), SQLite, APScheduler
- **AI:** OpenAI GPT-4o-mini (summarization, sentiment, key insights)
- **Frontend:** React 18, Vite, TailwindCSS, Lucide icons
- **Data Source:** NewsData.io REST API

## Quick Start (< 5 minutes)

### Prerequisites
- Python 3.11+
- Node.js 18+
- API keys for [NewsData.io](https://newsdata.io) (free tier works) and [OpenAI](https://platform.openai.com)

### 1. Clone & configure

```bash
git clone <repo-url>
cd ai-powered-news-intelligence-platform
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# Edit .env and add your NEWSDATA_API_KEY and OPENAI_API_KEY
```

### 3. Start the backend

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app

Visit **http://localhost:5173** — click **"Fetch News"** in the top-right to pull articles and run AI analysis.

---

## Features

### Data Pipeline
- Fetches articles from NewsData.io across configurable categories
- Pagination support with automatic deduplication by article ID
- Data cleaning & validation before persistence
- Scheduled auto-refresh every 30 minutes (configurable)

### AI Analysis (per article)
- **Summary:** 1-2 sentence factual summary via GPT-4o-mini
- **Sentiment:** Positive / Negative / Neutral with -1.0 to +1.0 score
- **Key Insights:** 3-5 actionable bullet points extracted per article

### Dashboard
- Responsive grid layout with article cards
- Real-time search across titles, descriptions, and AI summaries
- Filter by category (technology, business, science, health, etc.)
- Filter by sentiment (positive, negative, neutral)
- Sentiment breakdown stats
- Pagination

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | List articles (search, filter, paginate) |
| GET | `/api/articles/stats` | Dashboard statistics |
| GET | `/api/articles/{id}` | Single article detail |
| POST | `/api/pipeline/trigger` | Fetch + AI-process new articles |
| POST | `/api/pipeline/ai-process` | AI-process existing unanalyzed articles |
| GET | `/health` | Health check |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEWSDATA_API_KEY` | ✅ | — | NewsData.io API key |
| `OPENAI_API_KEY` | ✅ | — | OpenAI API key |
| `DATABASE_URL` | — | `sqlite+aiosqlite:///./news_intelligence.db` | SQLAlchemy DB URL |
| `FETCH_INTERVAL_MINUTES` | — | `30` | Auto-fetch interval |
| `NEWS_CATEGORIES` | — | `technology,business,science,health` | Comma-separated categories |
| `NEWS_LANGUAGE` | — | `en` | Article language |
| `MAX_ARTICLES_PER_FETCH` | — | `50` | Max articles per pipeline run |

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, lifespan
│   │   ├── config.py        # Pydantic settings
│   │   ├── database.py      # SQLAlchemy async engine
│   │   ├── models.py        # Article ORM model
│   │   ├── pipeline.py      # NewsData.io fetch + clean + store
│   │   ├── ai_processor.py  # OpenAI summarization/sentiment/insights
│   │   ├── scheduler.py     # APScheduler background jobs
│   │   └── routers/
│   │       ├── articles.py  # GET /articles, /stats, /{id}
│   │       └── pipeline.py  # POST /pipeline/trigger
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/client.js
│   │   ├── hooks/useArticles.js
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── StatsBar.jsx
│   │       ├── FilterBar.jsx
│   │       ├── ArticleCard.jsx
│   │       ├── SentimentBadge.jsx
│   │       ├── CategoryBadge.jsx
│   │       ├── Pagination.jsx
│   │       ├── SkeletonCard.jsx
│   │       └── EmptyState.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```
