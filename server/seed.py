"""
Seed the database with demo traders, customers, and debts.
Run: python seed.py from the server/ directory.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from passlib.context import CryptContext
from app.database import SessionLocal, engine
from app.models import Base, Trader, Customer, Debt
from app.models.debt import DebtStatus
import bcrypt

Base.metadata.create_all(bind=engine)

def get_hash(pin: str) -> str:
    return bcrypt.hashpw(pin.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed():
    db = SessionLocal()
    try:
        if db.query(Trader).count() > 0:
            print("Database already seeded. Skipping.")
            return

        # --- Traders ---
        traders = [
            Trader(
                name="Mama Titi",
                phone="08012345678",
                business_name="Mama Titi's Store",
                pin_hash=get_hash("1234"),
            ),
            Trader(
                name="Alhaji Bello",
                phone="08098765432",
                business_name="Bello Agro",
                pin_hash=get_hash("5678"),
            ),
        ]
        db.add_all(traders)
        db.flush()

        # --- Customers ---
        customers = [
            Customer(trader_id=traders[0].id, name="Chidi Okonkwo", phone="08011112222"),
            Customer(trader_id=traders[0].id, name="Ngozi Eze", phone="08033334444"),
            Customer(trader_id=traders[0].id, name="Ahmed Musa", phone="08055556666"),
            Customer(trader_id=traders[1].id, name="Emeka Obi", phone="08077778888"),
        ]
        db.add_all(customers)
        db.flush()

        # --- Debts (mix of PENDING and PAID) ---
        debts = [
            Debt(
                trader_id=traders[0].id,
                customer_id=customers[0].id,
                amount=20000,
                description="Fertilizer supply",
                payment_ref="KK-DEMO0001",
                virtual_account_no="9091234567",
                ussd_string="*322*20000*9091234567#",
                status=DebtStatus.PENDING,
            ),
            Debt(
                trader_id=traders[0].id,
                customer_id=customers[1].id,
                amount=5500,
                description="Rice (50kg bag)",
                payment_ref="KK-DEMO0002",
                virtual_account_no="9092345678",
                ussd_string="*322*5500*9092345678#",
                status=DebtStatus.PENDING,
            ),
            Debt(
                trader_id=traders[0].id,
                customer_id=customers[0].id,
                amount=3000,
                description="Palm oil",
                payment_ref="KK-DEMO0003",
                virtual_account_no="9093456789",
                ussd_string="*322*3000*9093456789#",
                status=DebtStatus.PAID,
            ),
            Debt(
                trader_id=traders[0].id,
                customer_id=customers[2].id,
                amount=12000,
                description="Yam tubers",
                payment_ref="KK-DEMO0004",
                virtual_account_no="9094567890",
                ussd_string="*322*12000*9094567890#",
                status=DebtStatus.PENDING,
            ),
            Debt(
                trader_id=traders[1].id,
                customer_id=customers[3].id,
                amount=45000,
                description="Maize (bulk)",
                payment_ref="KK-DEMO0005",
                virtual_account_no="9095678901",
                ussd_string="*322*45000*9095678901#",
                status=DebtStatus.PENDING,
            ),
        ]
        db.add_all(debts)
        db.commit()
        print("✅ Seed complete: 2 traders, 4 customers, 5 debts")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
