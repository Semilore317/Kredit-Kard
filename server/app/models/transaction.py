from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    debt_id: Mapped[int] = mapped_column(ForeignKey("debts.id"), index=True)
    trader_id: Mapped[int] = mapped_column(ForeignKey("traders.id"), index=True)
    
    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    payment_ref: Mapped[str] = mapped_column(String(100), index=True)
    channel: Mapped[str] = mapped_column(String(20), default="TRANSFER")
    status: Mapped[str] = mapped_column(String(20), default="SUCCESS")
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    debt: Mapped["Debt"] = relationship(back_populates="transactions")
