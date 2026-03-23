# KreditKard — Client

Frontend for the KreditKard trader dashboard.

## Stack

> To be decided by the frontend developer.

## API

The backend exposes a REST API documented at `/docs` (Swagger UI) when the server is running.

Base URL (local): `http://localhost:8000`

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register a new trader |
| `POST` | `/auth/login` | Login, returns JWT |
| `POST` | `/debts` | Log a new debt (auto-sends SMS to customer) |
| `GET`  | `/debts` | List all debts for the authenticated trader |
| `GET`  | `/customers` | List trader's customers with outstanding balances |
| `POST` | `/webhooks/interswitch` | Interswitch payment webhook (internal) |

### Authentication

All protected routes require:
```
Authorization: Bearer <token>
```

Obtain the token from `POST /auth/login`.

## Environment

The frontend should target the `VITE_API_URL` (or equivalent) environment variable pointing at the backend.
