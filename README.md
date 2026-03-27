# KreditKard

> **Digitizing Nigeria's ₦3 Trillion Informal Credit Economy.**
> Developed for the Interswitch X Enyata Hackathon.

KreditKard is a digital ledger system designed for Nigeria's market traders. It replaces traditional paper books with a mobile-first digital alternative that integrates real-time payment settlement via Interswitch virtual accounts.

---

## Live Demo & Documentation

- **Production Frontend**: [https://kreditkard.app](https://kreditkard.app)
- **Production API**: [https://api.kreditkard.app](https://api.kreditkard.app)
- **API Documentation (Swagger)**: [https://api.kreditkard.app/docs](https://api.kreditkard.app/docs)

---

## Demo Credentials (for Evaluators)

To explore the trader dashboard, use the following credentials on the login screen:

| Role | Phone Number | PIN |
|------|--------------|-----|
| **Trader 1** | `08012345678` | `1234` |
| **Trader 2** | `08098765432` | `5678` |

---

## The Problem & Solution

### The Problem
- **₦8 Billion Daily Loss**: Informal credit in Nigeria is massive but purely analog. Lost or damaged "tally books" lead to unrecoverable debt.
- **Dispute Deadlocks**: No digital proof of transaction when disputes arise between traders and customers.
- **Financial Exclusion**: 70M+ Nigerians on feature phones are locked out of modern smartphone-only fintech.

### The Solution: KreditKard
- **Digital Ledger**: Traders log debts in seconds via a mobile-first TailwindCSS dashboard.
- **Interswitch Integration**: Automatic provisioning of Interswitch Virtual Accounts for every recorded debt.
- **USSD/Transfer Payments**: Customers receive an SMS with a USSD code and pay from *any* phone—no internet or app required.
- **Instant Settlement**: Real-time payment confirmation via Interswitch webhooks automatically updates the trader's ledge.

---

## Technical Stack

- **Frontend**: React (Vite) + TypeScript + TailwindCSS
- **Backend**: FastAPI (Python 3.11) + PostgreSQL
- **Payments**: Interswitch Quickteller Business (Virtual Accounts & Webhooks)
- **Messaging**: Termii SMS Gateway
- **Infrastructure**: Docker + Pydantic (Configuration) + Alembic (Migrations)

---

## Technical Features

- **Automated Virtual Accounts**: Seamless provisioning via Interswitch for every transaction.
- **Real-time Webhooks**: Secure payment confirmation with HMAC-SHA512 verification.
- **Live Analytics**: Real-time credit limits, balances, and trends via Recharts.
- **Mobile-First UX**: Responsive dashboard optimized for market-side operational use.

---

## Monorepo Structure

```
kredit-kard/
├── server/       # FastAPI backend — Debt orchestration, Interswitch pipe, webhooks
├── client/       # React/TS frontend — Trader Dashboard UI
└── docker-compose.yml
```

---

## Quick Start (Local Setup)

### 1. Requirements
Ensure you have **Python 3.11+**, **Node.js**, and **PostgreSQL** installed.

### 2. Backend Setup
```bash
cd server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Configure DATABASE_URL and API Keys
alembic upgrade head
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## Project Repository
- **GitHub**: [https://github.com/Semilore317/Kredit-Kard](https://github.com/Semilore317/Kredit-Kard)

---

Developed with ❤️ for the Interswitch X Enyata Hackathon.
