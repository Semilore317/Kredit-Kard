from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "KreditKard"
    environment: str = "development"

    # Database
    database_url: str

    # JWT
    secret_key: str
    access_token_expire_minutes: int = 1440  # 24 hours

    # Interswitch
    interswitch_base_url: str = "https://sandbox.interswitchng.com"
    interswitch_client_id: str
    interswitch_client_secret: str

    # SMS & USSD (Africa's Talking)
    at_username: str
    at_api_key: str

    # Webhooks
    webhook_secret: str

    # Payment mode: 'live' uses real Interswitch API, 'mock' returns fake data (safe for demos)
    payment_mode: str = "mock"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
