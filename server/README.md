# KreditKard — Backend Ledger System

Digitizing Nigeria's informal credit economy through high-performance FastAPI architecture and Interswitch integration.

## 📌 Problem Statement
Informal credit in Nigeria is massive but purely analog. Market traders log debts in paper ledgers, leading to disputes, lost records, and unreliable collection. KreditKard digitizes this "book" economy, providing a secure, mobile-first interface to log debts, auto-generate USSD/Transfer payment codes, and settle balances in real-time via integrated virtual accounts.

## 🏗 Technical Architecture

- **FastAPI**: High-performance Python framework for rapid API development.
- **Interswitch Quickteller Business**: Real-time dynamic virtual account provisioning via Interswitch APIs.
- **PostgreSQL**: Relational database ensuring transactional integrity for financial ledgers.
- **Alembic**: Database migration management.
- **Termii SMS**: Automated customer notifications and payment confirmations.
- **Pydantic Settings**: Secure, environment-based configuration management.

---

## 🛠 Setup & Local Development

### Prerequisites
- Python 3.11+
- PostgreSQL
- Termii & Interswitch API Keys (available in `.env.example`)

### Installation

```bash
cd server

# 1. Environment Setup
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# 2. Install Dependencies
pip install -r requirements.txt

# 3. Configure Environment
cp .env.example .env
# Edit .env with your DATABASE_URL and API keys

# 4. Initialize Database
alembic upgrade head

# 5. Start Application
uvicorn app.main:app --reload
```

---

## 🔌 API Reference

Full interactive documentation is available at: `http://localhost:8000/docs`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Trader onboarding |
| `POST` | `/auth/login` | Secure JWT authentication |
| `POST` | `/debts` | Log new debt + Provision Interswitch Virtual Account |
| `GET` | `/debts` | List all debts (search/filter supported) |
| `GET` | `/analytics/dashboard` | **Live** aggregation: Credit limits, balance, and trends |
| `POST` | `/webhooks/interswitch` | Secure payment confirmation via Interswitch callback |

---

## 🤝 Team Contributions

- **Technical Lead / Backend**: [Placeholder]
- **Frontend Engineer**: [Placeholder]
- **Product Designer**: [Placeholder]
- **Quality Assurance**: [Placeholder]

## 🚀 Backend Contribution Guide

### Local Environment
Ensure you have a local PostgreSQL instance. Use Docker if preferred:
`docker run --name kk-postgres -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres`

### PR Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes using Conventional Commits (e.g., `feat: add analytics endpoint`).
3. Run tests before pushing: `pytest`
4. Submit a PR to the `main` branch.

### API Documentation
- Local: [http://localhost:8000/docs](http://localhost:8000/docs)
- Production: [https://api.kreditkard.app/docs](https://api.kreditkard.app/docs)
