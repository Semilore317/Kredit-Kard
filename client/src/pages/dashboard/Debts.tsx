import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { debts, type DebtStatus } from "../../data/mockData";

const statuses: (DebtStatus | "ALL")[] = ["ALL", "PENDING", "PAID", "PART PAID", "OVERDUE"];

const Debts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DebtStatus | "ALL">("ALL");

  const filtered = debts.filter((d) => {
    const matchSearch =
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search);
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900">Debts</h1>
        <button
          onClick={() => navigate("/app/debts/new")}
          className="flex items-center gap-2 bg-brand-primary-500 hover:bg-brand-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Debt
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search name, phone, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DebtStatus | "ALL")}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-10 px-4 py-4"><input type="checkbox" className="rounded" /></th>
              <th className="text-left px-4 py-4 text-slate-500 font-medium">Customer</th>
              <th className="text-left px-4 py-4 text-slate-500 font-medium">Amount</th>
              <th className="text-left px-4 py-4 text-slate-500 font-medium">Status</th>
              <th className="text-left px-4 py-4 text-slate-500 font-medium">Created</th>
              <th className="text-left px-4 py-4 text-slate-500 font-medium">Due</th>
              <th className="w-10 px-4 py-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((debt) => (
              <tr key={debt.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{debt.customer}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{debt.phone}</p>
                </td>
                <td className="px-4 py-4 font-bold text-slate-900">₦{debt.amount.toLocaleString()}</td>
                <td className="px-4 py-4"><StatusBadge label={debt.status} /></td>
                <td className="px-4 py-4 text-slate-500">{debt.created}</td>
                <td className="px-4 py-4 text-slate-500">{debt.due}</td>
                <td className="px-4 py-4">
                  <button className="p-1 rounded hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">No debts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Debts;
