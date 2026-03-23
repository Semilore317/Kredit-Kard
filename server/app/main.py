from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, debts, customers, webhooks

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
    allow_origins=["*"],  # Tighten to frontend URL before production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(debts.router)
app.include_router(customers.router)
app.include_router(webhooks.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "version": "1.0.0", "app": settings.app_name}
