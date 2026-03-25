import { type ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-slate-500 font-medium">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
};

export default StatCard;
