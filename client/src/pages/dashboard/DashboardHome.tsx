import { useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import StatCard from "../../components/dashboard/StatCard";
const collectionsOverTime = [
  { date: "Jan 1", amount: 14000 },
  { date: "Jan 8", amount: 19500 },
  { date: "Jan 15", amount: 19500 },
  { date: "Jan 22", amount: 25500 },
  { date: "Jan 29", amount: 19000 },
  { date: "Feb 5", amount: 14000 },
  { date: "Feb 8", amount: 17000 },
  { date: "Feb 10", amount: 14000 },
  { date: "Feb 12", amount: 14000 },
  { date: "Feb 14", amount: 8000 },
  { date: "Feb 16", amount: 5500 },
];
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { fetchDebts } from "../../store/slices/debtsSlice";
import { fetchCustomers } from "../../store/slices/customersSlice";

const DashboardHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: debts, status: debtsStatus } = useSelector((state: RootState) => state.debts);
  const { items: customers, status: customersStatus } = useSelector((state: RootState) => state.customers);

  useEffect(() => {
    if (debtsStatus === 'idle') {
      dispatch(fetchDebts());
    }
    if (customersStatus === 'idle') {
      dispatch(fetchCustomers());
    }
  }, [dispatch, debtsStatus, customersStatus]);

  const totalOutstanding = useMemo(() => debts
    .filter(d => d.status !== "PAID" && d.status !== "CANCELLED")
    .reduce((sum, d) => sum + d.amount, 0), [debts]);

  const overdueCount = useMemo(() => debts.filter(d => d.status === "OVERDUE").length, [debts]);
  const paidCount = useMemo(() => debts.filter(d => d.status === "PAID").length, [debts]);
  const pendingCount = useMemo(() => debts.filter(d => d.status === "PENDING").length, [debts]);

  const debtStatusData = useMemo(() => [
    { name: "Paid", value: paidCount, color: "#10b981" },
    { name: "Pending", value: pendingCount, color: "#f59e0b" },
    { name: "Overdue", value: overdueCount, color: "#ef4444" },
  ].filter(d => d.value > 0), [paidCount, pendingCount, overdueCount]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Outstanding"
          value={`₦${totalOutstanding.toLocaleString()}`}
          icon={<span className="text-brand-primary-500">$</span>}
        />
        <StatCard
          label="Collected This Week"
          value="₦0"
          icon={<span className="text-green-500">↗</span>}
        />
        <StatCard
          label="Overdue Debts"
          value={String(overdueCount)}
          icon={<span className="text-brand-primary-400">⚠</span>}
        />
        <StatCard
          label="Active Customers"
          value={String(customers.length)}
          icon={<span className="text-brand-primary-500">👥</span>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Collections Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={collectionsOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
                formatter={(v: any) => [`₦${Number(v).toLocaleString()}`, "Amount"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#fe571b"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#fe571b", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Debt Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            {debtStatusData.length > 0 ? (
              <PieChart>
                <Pie
                  data={debtStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {debtStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 12, color: "#64748b" }}>{value}</span>}
                />
                <Tooltip formatter={(v: any) => [v, "Debts"]} />
              </PieChart>
            ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  No debts to display yet.
                </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
