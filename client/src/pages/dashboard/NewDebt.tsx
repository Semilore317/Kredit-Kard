import { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { addDebt } from "../../store/slices/debtsSlice";
import { fetchCustomers } from "../../store/slices/customersSlice";

interface NewDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewDebtModal = ({ isOpen, onClose }: NewDebtModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    amount: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const action = await dispatch(addDebt({
      customer_name: form.customerName,
      customer_phone: form.customerPhone,
      amount: Number(form.amount),
      description: form.description
    }));
    
    setIsSubmitting(false);
    if (addDebt.fulfilled.match(action)) {
      dispatch(fetchCustomers()); // refresh so Active Customers count updates immediately
      onClose();
      // Reset form
      setForm({ customerName: "", customerPhone: "", amount: "", description: "" });
    } else {
      alert("Failed to create debt");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">New Debt</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Customer Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Customer Name</label>
            <input
              type="text"
              name="customerName"
              placeholder="John Doe"
              value={form.customerName}
              onChange={handleChange}
              required
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>

          {/* Customer Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Customer Phone</label>
            <input
              type="tel"
              name="customerPhone"
              placeholder="08031234567"
              value={form.customerPhone}
              onChange={handleChange}
              required
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
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

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Description / Notes</label>
            <textarea
              name="description"
              placeholder="Add any notes..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
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
              className="flex-1 bg-brand-primary-500 hover:bg-brand-primary-600 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Debt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDebtModal;
