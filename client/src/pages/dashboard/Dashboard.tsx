import React, { useState } from "react";
import useSWR from "swr";
import apiClient from "../../api/client";
import DebtCard from "../../components/DebtCard";
import LogDebtModal from "../../components/LogDebtModal";
import { formatCurrencyNaira } from "../../utils/currency";
import { Plus, Settings2 } from "lucide-react";
import { Link } from "react-router";

// Native fetcher for SWR
const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

interface Debt {
  id: number;
  customer_name: string;
  customer_phone: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  created_at: string;
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Poll debts every 5 seconds, actively forcing UI to wake up if the user refocuses the PWA window
  const { data: debts, error, isLoading } = useSWR<Debt[]>(
    "/debts?status=PENDING",
    fetcher,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  // Calculate the massive 'Total Owed' hero stat
  const totalOwed = debts?.reduce((sum, debt) => sum + (debt.amount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-white relative pb-24 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b-[3px] border-slate-900 px-6 py-5 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-2xl font-black tracking-tight uppercase">KreditKard</h1>
        <Link to="/settings" className="p-2 -mr-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors border-2 border-transparent focus:border-slate-900">
          <Settings2 className="w-7 h-7" />
        </Link>
      </header>

      {/* Hero Stat Panel */}
      <section className="bg-slate-900 text-white px-6 py-12 border-b-[6px] border-[#fbbf24]">
        <p className="text-slate-300 font-bold tracking-widest text-sm uppercase mb-3">Total Owed (Outstanding)</p>
        <h2 className="text-5xl font-black tracking-tighter truncate">
          {formatCurrencyNaira(totalOwed)}
        </h2>
      </section>

      {/* Debt List Panel */}
      <main className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-end mb-6 mt-6">
          <h3 className="font-bold text-slate-600 uppercase tracking-widest text-sm">Active Debtors</h3>
          <span className="font-bold text-white bg-slate-900 px-3 py-1 rounded-full text-xs border border-slate-900 shadow-sm">
            {debts?.length || 0}
          </span>
        </div>

        {isLoading && !debts ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-[3px] border-red-900 p-6 rounded-xl text-red-900 font-bold text-center">
            Failed to connect to KreditKard network.
          </div>
        ) : debts?.length === 0 ? (
          <div className="text-center py-16 px-6 border-[3px] border-dashed border-slate-300 rounded-2xl bg-slate-50">
            <p className="text-slate-900 font-black text-2xl uppercase">No pending debts!</p>
            <p className="text-slate-600 font-medium text-base mt-2">Mama is fully paid up for the day.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {debts?.map((debt) => (
              <DebtCard key={debt.id} {...debt} />
            ))}
          </div>
        )}
      </main>

      {/* Fixed Action Button */}
      <div className="fixed bottom-8 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#fbbf24] text-slate-900 w-[72px] h-[72px] rounded-full shadow-[6px_6px_0px_#0f172a] flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform border-[3px] border-slate-900"
        >
          <Plus className="w-10 h-10 stroke-[3px]" />
        </button>
      </div>

      <LogDebtModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
