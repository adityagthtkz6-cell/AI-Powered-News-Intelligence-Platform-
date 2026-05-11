from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    newsdata_api_key: str = ""
    openai_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./news_intelligence.db"
    fetch_interval_minutes: int = 30
    news_categories: str = "technology,business,science,health"
    news_language: str = "en"
    max_articles_per_fetch: int = 50

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()


def get_settings() -> Settings:
    return settings
