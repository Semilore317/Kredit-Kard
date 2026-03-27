from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, debts, customers, webhooks, analytics

settings = get_settings()

app = FastAPI(
    title="KreditKard API",
    description=(
        "Digitizing Nigeria's informal credit economy. "
        "Log debts, generate USSD payment codes, and clear balances via webhook."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
)

app.include_router(auth.router)
app.include_router(debts.router)
app.include_router(customers.router)
app.include_router(webhooks.router)
app.include_router(analytics.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "version": "1.0.0", "app": settings.app_name, "payment_mode": settings.payment_mode}
