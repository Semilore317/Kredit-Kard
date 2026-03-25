import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { messages, customers } from "../../data/mockData";

const Messages = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [template, setTemplate] = useState("reminder");

  const toggleCustomer = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900">Messages</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 bg-brand-primary-500 hover:bg-brand-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Compose
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-slate-500 font-medium">To</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Message</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{m.to}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{m.phone}</p>
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-sm">
                  <p className="truncate">{m.message}</p>
                </td>
                <td className="px-6 py-4"><StatusBadge label={m.status} /></td>
                <td className="px-6 py-4 text-slate-500">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Compose Reminder</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Template */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Template</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none"
                >
                  <option value="reminder">Payment Reminder</option>
                  <option value="overdue">Overdue Notice</option>
                  <option value="receipt">Payment Receipt</option>
                </select>
              </div>

              {/* Customer checklist */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Select Customers</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                  {customers.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(c.id)}
                        onChange={() => toggleCustomer(c.id)}
                        className="rounded"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompose(false)}
                  className="flex-1 border border-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCompose(false)}
                  className="flex-1 bg-brand-primary-500 hover:bg-brand-primary-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                  Send {selected.length > 0 ? `(${selected.length})` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
