import { useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import StatCard from "../../components/dashboard/StatCard";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { fetchDebts } from "../../store/slices/debtsSlice";
import { fetchCustomers } from "../../store/slices/customersSlice";

/** Returns the Monday of the ISO week containing `date` */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

  /** Group debts by week-start, sum amounts per week, sort chronologically */
  const collectionsOverTime = useMemo(() => {
    const buckets = new Map<string, { ts: number; amount: number }>();
    for (const debt of debts) {
      const weekStart = getWeekStart(new Date(debt.created_at));
      const key = weekStart.toISOString();
      const existing = buckets.get(key);
      if (existing) {
        existing.amount += debt.amount;
      } else {
        buckets.set(key, { ts: weekStart.getTime(), amount: debt.amount });
      }
    }
    return Array.from(buckets.values())
      .sort((a, b) => a.ts - b.ts)
      .map(({ ts, amount }) => {
        const d = new Date(ts);
        const label = `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
        return { date: label, amount };
      });
  }, [debts]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          {collectionsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={collectionsOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${Number(v).toLocaleString()}`} />
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
          ) : (
            <div className="flex h-65 items-center justify-center text-slate-400 text-sm">
              No debt data to display yet.
            </div>
          )}
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Debt Status</h2>
          {debtStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
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
            </ResponsiveContainer>
          ) : (
            <div className="flex h-65 items-center justify-center text-slate-400 text-sm">
              No debts to display yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
