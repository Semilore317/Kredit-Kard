type BadgeVariant =
  | "PENDING"
  | "PAID"
  | "PART PAID"
  | "OVERDUE"
  | "SENT"
  | "FAILED"
  | "SUCCESS"
  | "TRANSFER"
  | "USSD"
  | "QR"
  | "CARD";

const variantStyles: Record<BadgeVariant, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  "PART PAID": "bg-blue-100 text-blue-700",
  OVERDUE: "bg-red-100 text-red-600",
  SENT: "bg-slate-100 text-slate-600",
  FAILED: "bg-red-100 text-red-600",
  SUCCESS: "bg-green-100 text-green-700",
  TRANSFER: "bg-slate-100 text-slate-700",
  USSD: "bg-slate-100 text-slate-700",
  QR: "bg-slate-100 text-slate-700",
  CARD: "bg-slate-100 text-slate-700",
};

interface StatusBadgeProps {
  label: BadgeVariant | string;
}

const StatusBadge = ({ label }: StatusBadgeProps) => {
  const style = variantStyles[label as BadgeVariant] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${style}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
