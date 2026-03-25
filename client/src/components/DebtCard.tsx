import { formatCurrencyNaira } from "../utils/currency";
import StatusBadge from "./StatusBadge";

interface DebtCardProps {
  id: number;
  customer_name: string;
  customer_phone: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  payment_ref: string;
  created_at: string;
}

export default function DebtCard({ customer_name, customer_phone, amount, status, payment_ref }: DebtCardProps) {
  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-xl p-4 flex flex-col gap-3 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-slate-900 leading-tight">{customer_name}</h3>
          <p className="font-mono text-sm text-slate-600 mt-1">{customer_phone}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="pt-2 border-t-2 border-slate-100 flex justify-between items-end">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Ref: {payment_ref}</span>
        <span className="text-2xl font-black text-slate-900">{formatCurrencyNaira(amount)}</span>
      </div>
    </div>
  );
}
