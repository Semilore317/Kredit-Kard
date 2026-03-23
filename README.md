# KreditKard

> Digitizing Nigeria's ₦3 Trillion Informal Credit Economy.

## Monorepo Structure

```
kredit-kard/
├── server/   # FastAPI backend — debt logging, Interswitch payment pipe, webhooks
└── client/   # Frontend (separate dev) — trader dashboard UI
```

## The Problem

- ₦8 Billion in informal credit lost daily to paper tally books
- No digital proof when disputes arise
- 70M+ Nigerians on feature phones locked out of smartphone-only fintech

## The Solution

KreditKard is a digital tally system. A trader logs a debt in seconds → the customer gets an SMS with a USSD payment code → they pay on any phone, no internet required → the trader's ledger updates instantly via webhook.

## Quick Start

See [`server/README.md`](./server/README.md) to run the backend.
