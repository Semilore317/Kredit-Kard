import { useState } from "react";
import { X, Zap } from "lucide-react";
import type { Debt } from "../../services/debtsService";
import { debtsService } from "../../services/debtsService";

interface SimulatePaymentModalProps {
  debt: Debt;
  onClose: () => void;
  onSuccess: () => void;
}

const SimulatePaymentModal = ({ debt, onClose, onSuccess }: SimulatePaymentModalProps) => {
  const remaining = debt.amount - (debt.total_paid ?? 0);
  const [amount, setAmount] = useState(String(remaining));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dueDate = new Date(debt.due_date || debt.created_at);
  const today = new Date();
  const diffMs = today.getTime() - dueDate.getTime();
  const daysOverdue = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (parsed > remaining) {
      setError(`Amount cannot exceed the remaining balance of ₦${remaining.toLocaleString()}.`);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await debtsService.simulatePayment(debt.payment_ref, parsed);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Simulation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-900">Simulate Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <div className="px-6 pt-5 pb-2 flex flex-col gap-4">
          <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span className="font-semibold text-slate-900">{debt.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Debt</span>
              <span className="font-bold text-slate-900">₦{debt.amount.toLocaleString()}</span>
            </div>
            {(debt.total_paid ?? 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Already Paid</span>
                <span className="font-semibold text-emerald-600">₦{(debt.total_paid ?? 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span className="text-slate-500 font-medium">Remaining</span>
              <span className="font-bold text-brand-primary-500">₦{remaining.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Due Date</span>
              <span className="font-medium text-slate-700">
                {dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            {daysOverdue > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Days Overdue</span>
                <span className="font-semibold text-red-500">{daysOverdue} {daysOverdue === 1 ? "day" : "days"}</span>
              </div>
            )}
          </div>

          {/* Amount Input */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Amount to Repay (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                max={remaining}
                step="any"
                required
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                placeholder={`Max ₦${remaining.toLocaleString()}`}
              />
              <p className="text-xs text-slate-400">Max: ₦{remaining.toLocaleString()}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm">{error}</div>
            )}

            <div className="flex gap-3 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {isSubmitting ? "Simulating..." : "Simulate Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimulatePaymentModal;
