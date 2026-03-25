import { useState } from "react";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { transactions, type TxnChannel, type TxnStatus } from "../../data/mockData";

const statusOptions: (TxnStatus | "ALL")[] = ["ALL", "PENDING", "SUCCESS", "FAILED"];
const channelOptions: (TxnChannel | "ALL")[] = ["ALL", "TRANSFER", "USSD", "QR", "CARD"];

const Transactions = () => {
  const [statusFilter, setStatusFilter] = useState<TxnStatus | "ALL">("ALL");
  const [channelFilter, setChannelFilter] = useState<TxnChannel | "ALL">("ALL");

  const filtered = transactions.filter((t) => {
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchChannel = channelFilter === "ALL" || t.channel === channelFilter;
    return matchStatus && matchChannel;
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Transactions</h1>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TxnStatus | "ALL")}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>
          ))}
        </select>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value as TxnChannel | "ALL")}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer"
        >
          {channelOptions.map((c) => (
            <option key={c} value={c}>{c === "ALL" ? "All Channels" : c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Reference</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Customer</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Amount</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Channel</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-500 text-xs">{t.reference}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{t.customer}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₦{t.amount.toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge label={t.channel} /></td>
                <td className="px-6 py-4"><StatusBadge label={t.status} /></td>
                <td className="px-6 py-4 text-slate-500">{t.date}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
