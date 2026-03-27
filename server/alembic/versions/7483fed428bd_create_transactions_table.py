"""create_transactions_table

Revision ID: 7483fed428bd
Revises: 202603272040
Create Date: 2026-03-27 23:09:46.062600

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7483fed428bd'
down_revision: Union[str, Sequence[str], None] = '202603272040'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('debt_id', sa.Integer(), nullable=False),
        sa.Column('trader_id', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('payment_ref', sa.String(length=100), nullable=False),
        sa.Column('channel', sa.String(length=20), nullable=False, server_default='TRANSFER'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='SUCCESS'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['debt_id'], ['debts.id'], ),
        sa.ForeignKeyConstraint(['trader_id'], ['traders.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transactions_debt_id'), 'transactions', ['debt_id'], unique=False)
    op.create_index(op.f('ix_transactions_id'), 'transactions', ['id'], unique=False)
    op.create_index(op.f('ix_transactions_payment_ref'), 'transactions', ['payment_ref'], unique=False)
    op.create_index(op.f('ix_transactions_trader_id'), 'transactions', ['trader_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('transactions')
