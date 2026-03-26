import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchCustomers } from "../../store/slices/customersSlice";
import { fetchDebts } from "../../store/slices/debtsSlice";

const Customers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");

  const { items: customers, status: customerStatus } = useSelector((state: RootState) => state.customers);
  const { items: debts, status: debtsStatus } = useSelector((state: RootState) => state.debts);

  useEffect(() => {
    if (customerStatus === 'idle') {
      dispatch(fetchCustomers());
    }
    if (debtsStatus === 'idle') {
      dispatch(fetchDebts());
    }
  }, [dispatch, customerStatus, debtsStatus]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const getOutstanding = (phone: string) => {
    return debts
      .filter((d) => d.customer.phone === phone && d.status !== 'PAID' && d.status !== 'CANCELLED')
      .reduce((sum, d) => sum + d.amount, 0);
  };

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
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Name</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Phone</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Outstanding</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-slate-500">{c.phone}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₦{getOutstanding(c.phone).toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400">
                  {customerStatus === 'loading' ? 'Loading customers...' : 'No customers found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
