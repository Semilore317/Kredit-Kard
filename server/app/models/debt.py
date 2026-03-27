import enum
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class DebtStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    PART_PAID = "PART PAID"
    CANCELLED = "CANCELLED"


class Debt(Base):
    __tablename__ = "debts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    trader_id: Mapped[int] = mapped_column(ForeignKey("traders.id"), index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), index=True)

    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    total_paid: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[DebtStatus] = mapped_column(
        Enum(DebtStatus, name="debtstatus", native_enum=True, values_callable=lambda obj: [e.value for e in obj]), 
        default=DebtStatus.PENDING, 
        index=True
    )

    # Interswitch payment details
    payment_ref: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    virtual_account_no: Mapped[str | None] = mapped_column(String(20), nullable=True)
    ussd_string: Mapped[str | None] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    trader: Mapped["Trader"] = relationship(back_populates="debts")
    customer: Mapped["Customer"] = relationship(back_populates="debts")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="debt")
