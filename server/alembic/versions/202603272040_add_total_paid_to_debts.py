"""add total_paid and part paid status

Revision ID: 202603272040
Revises: bab60ff6a8b9
Create Date: 2026-03-27 20:40:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '202603272040'
down_revision: Union[str, Sequence[str], None] = 'bab60ff6a8b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add total_paid column
    # Using server_default for existing rows
    op.add_column('debts', sa.Column('total_paid', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.0'))
    
    # 2. Add 'PART PAID' to debtstatus enum
    # PostgreSQL specific: ALTER TYPE ... ADD VALUE must run outside a transaction
    # in older versions, but here we can just use op.execute.
    # We use autocommit_block to ensure it runs correctly on Postgres.
    try:
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE debtstatus ADD VALUE 'PART PAID'")
    except Exception as e:
        # If it already exists or we're on SQLite (which doesn't use TYPE), ignore
        print(f"Skipping enum update: {e}")


def downgrade() -> None:
    # Remove total_paid
    op.drop_column('debts', 'total_paid')
    # Removing a value from an enum is complex in Postgres (requires creating a new type)
    # Skipping for simplicity in downgrade.
