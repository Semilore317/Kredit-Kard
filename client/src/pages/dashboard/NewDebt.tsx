import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { customers } from "../../data/mockData";

const NewDebt = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    dueDate: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would POST to API in real app
    navigate("/app/debts");
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      {/* Back */}
      <button
        onClick={() => navigate("/app/debts")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Debts
      </button>

      <h1 className="text-2xl font-extrabold text-slate-900">New Debt</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-5">
        {/* Customer */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Customer</label>
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            required
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400 bg-white"
          >
            <option value="">Select a customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Amount (₦)</label>
          <input
            type="number"
            name="amount"
            placeholder="e.g. 25000"
            value={form.amount}
            onChange={handleChange}
            required
            min={1}
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
          />
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Notes (optional)</label>
          <textarea
            name="notes"
            placeholder="Add any notes..."
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate("/app/debts")}
            className="flex-1 border border-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand-primary-500 hover:bg-brand-primary-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            Create Debt
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDebt;
