import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import StatusBadge from "../../components/dashboard/StatusBadge";

type TxnStatus = "PENDING" | "SUCCESS" | "FAILED";
type TxnChannel = "TRANSFER" | "USSD" | "QR" | "CARD";

const statusOptions: (TxnStatus | "ALL")[] = ["ALL", "PENDING", "SUCCESS", "FAILED"];
const channelOptions: (TxnChannel | "ALL")[] = ["ALL", "TRANSFER", "USSD", "QR", "CARD"];

const Transactions = () => {
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TxnStatus | "ALL">("ALL");
  const [channelFilter, setChannelFilter] = useState<TxnChannel | "ALL">("ALL");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get('/transactions');
        setTxns(response.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const transactions = txns.map(t => ({
    id: t.id,
    reference: t.payment_ref,
    customer: t.customer_name || "Unknown",
    amount: t.amount,
    channel: t.channel as TxnChannel,
    status: t.status === "SUCCESS" ? "SUCCESS" : "FAILED" as TxnStatus,
    date: new Date(t.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  }));

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

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
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
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    {loading ? "Loading transactions..." : "No transactions found."}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-slate-900 text-base">{t.customer}</p>
                <p className="text-slate-400 text-xs mt-0.5">{t.reference}</p>
              </div>
              <StatusBadge label={t.status} />
            </div>
            
            <div className="flex justify-between items-end mt-1">
              <p className="font-bold text-slate-900 text-base">₦{t.amount.toLocaleString()}</p>
              <p className="text-slate-500 text-sm tracking-wide">
                {t.channel} &middot; {t.date}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-100">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
