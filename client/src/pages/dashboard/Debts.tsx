import { useState, useEffect } from "react";
import { Plus, Search, XCircle, Zap } from "lucide-react";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { fetchDebts, cancelDebt } from "../../store/slices/debtsSlice";
import type { Debt } from "../../services/debtsService";
import NewDebtModal from "./NewDebt";
import SimulatePaymentModal from "../../components/dashboard/SimulatePaymentModal";

const statuses = ["ALL", "PENDING", "PAID", "PART PAID", "OVERDUE"];

const Debts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulateDebt, setSimulateDebt] = useState<Debt | null>(null);

  const { items: debts, status } = useSelector((state: RootState) => state.debts);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDebts());
    }
  }, [status, dispatch]);

  const handleCancel = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel this debt?")) {
      dispatch(cancelDebt(id));
    }
  };

  const filtered = debts.filter((d) => {
    const matchSearch =
      d.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.phone.includes(search);
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900">Debts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
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
            placeholder="Search name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Customer</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Amount</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Due Date</th>
              <th className="text-right px-6 py-4 text-slate-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((debt) => (
              <tr key={debt.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{debt.customer.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{debt.customer.phone}</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  ₦{debt.amount.toLocaleString()}
                  {debt.status === "PART PAID" && (
                    <div className="text-[10px] text-brand-primary-600 font-semibold mt-0.5">
                      Paid: ₦{debt.total_paid.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4"><StatusBadge label={debt.status} /></td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date((debt as any).due_date || debt.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {(debt.status === "PENDING" || debt.status === "PART PAID" || debt.status === "OVERDUE") && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSimulateDebt(debt); }}
                        className="text-emerald-600 hover:text-emerald-800 font-medium p-1 transition-colors flex items-center gap-1"
                        title="Simulate Payment"
                      >
                        <Zap className="w-4 h-4" /> Simulate
                      </button>
                    )}
                    {debt.status === "PENDING" && (
                      <button
                        onClick={(e) => handleCancel(e, debt.id)}
                        className="text-red-500 hover:text-red-700 font-medium p-1 transition-colors flex items-center gap-1"
                        title="Cancel Debt"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  {status === 'loading' ? 'Loading debts...' : 'No debts found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.map((debt) => (
          <div key={debt.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-slate-900 text-base">{debt.customer.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{debt.customer.phone}</p>
              </div>
              <StatusBadge label={debt.status} />
            </div>
            
            <div className="flex justify-between items-end mt-1">
              <p className="font-bold text-slate-900 text-base">₦{debt.amount.toLocaleString()}</p>
              <p className="text-slate-500 text-sm">
                Due: {new Date((debt as any).due_date || debt.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            {(debt.status === "PENDING" || debt.status === "PART PAID" || debt.status === "OVERDUE") && (
              <div className="mt-2 pt-3 border-t border-slate-50 flex justify-end gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setSimulateDebt(debt); }}
                  className="text-emerald-600 hover:text-emerald-800 font-medium text-sm transition-colors flex items-center gap-1"
                >
                  <Zap className="w-4 h-4" /> Simulate Payment
                </button>
                {debt.status === "PENDING" && (
                  <button
                    onClick={(e) => handleCancel(e, debt.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-100">
            {status === 'loading' ? 'Loading debts...' : 'No debts found.'}
          </div>
        )}
      </div>

      <NewDebtModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {simulateDebt && (
        <SimulatePaymentModal
          debt={simulateDebt}
          onClose={() => setSimulateDebt(null)}
          onSuccess={() => dispatch(fetchDebts())}
        />
      )}
    </div>
  );
};

export default Debts;
