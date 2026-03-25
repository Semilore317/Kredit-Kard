import { useState } from "react";
import { Search } from "lucide-react";
import { customers } from "../../data/mockData";

const getRiskColor = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-600";
};

const Customers = () => {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Customers</h1>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Name</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Phone</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Risk Score</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Outstanding</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Last Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-slate-500">{c.phone}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold ${getRiskColor(c.riskScore)}`}>
                    {c.riskScore}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">₦{c.outstanding.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-500">{c.lastPayment ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
