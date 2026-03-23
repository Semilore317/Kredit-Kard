# KreditKard — Server

FastAPI backend for KreditKard. Handles trader auth, debt logging, Interswitch virtual account provisioning, SMS notifications, and webhook-driven payment clearing.

## Prerequisites

- Python 3.11+
- PostgreSQL running locally (or a connection string to a hosted DB)

## Setup

```bash
cd server

# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, Interswitch credentials, Termii key, etc.

# 4. Run migrations
alembic upgrade head

# 5. (Optional) Seed demo data
python seed.py

# 6. Start the dev server
uvicorn app.main:app --reload
```

API docs available at: http://localhost:8000/docs

## Project Structure

```
server/
├── app/
│   ├── main.py           # FastAPI app, middleware, router registration
│   ├── config.py         # Pydantic settings (reads .env)
│   ├── database.py       # SQLAlchemy engine + get_db dependency
│   ├── dependencies.py   # JWT auth dependency (get_current_trader)
│   ├── models/
│   │   ├── trader.py
│   │   ├── customer.py
│   │   └── debt.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── debt.py
│   │   └── customer.py
│   ├── routers/
│   │   ├── auth.py       # POST /auth/register, POST /auth/login
│   │   ├── debts.py      # POST /debts, GET /debts, GET /debts/{id}, PATCH /debts/{id}/cancel
│   │   ├── customers.py  # GET /customers, GET /customers/{id}/debts
│   │   └── webhooks.py   # POST /webhooks/interswitch
│   └── services/
│       ├── interswitch.py  # Virtual account provisioning
│       └── sms.py          # Termii SMS wrapper
├── alembic/              # DB migrations
├── alembic.ini
├── seed.py               # Demo data seeder
├── requirements.txt
└── .env.example
```

## Key Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register trader |
| `POST` | `/auth/login` | ❌ | Login → JWT |
| `POST` | `/debts` | ✅ | Log debt, auto-provision virtual account + send SMS |
| `GET` | `/debts` | ✅ | List debts (filter by `?status=PENDING`) |
| `GET` | `/debts/{id}` | ✅ | Debt detail |
| `PATCH` | `/debts/{id}/cancel` | ✅ | Cancel a pending debt |
| `GET` | `/customers` | ✅ | Customers + outstanding balances |
| `GET` | `/customers/{id}/debts` | ✅ | Customer debt history |
| `POST` | `/webhooks/interswitch` | 🔑 sig | Interswitch payment webhook |
| `GET` | `/health` | ❌ | Health check |

## Running Tests

```bash
pytest
```
