import React, { useState } from "react";
import Button from "./Button";
import { formatPhoneToE164 } from "../utils/phone";
import apiClient from "../api/client";
import { X, CheckCircle } from "lucide-react";
import { mutate } from "swr";

export default function LogDebtModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !amount) return;
    
    setIsLoading(true);
    try {
      await apiClient.post("/debts", {
        customer_name: name,
        customer_phone: formatPhoneToE164(phone),
        amount: parseFloat(amount),
        description: "Market Credit",
      });
      
      // Auto-bust the SWR cache to instantly fetch the new log.
      mutate("/debts?status=PENDING");
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setName("");
        setPhone("");
        setAmount("");
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error(err);
      alert("Failed to log debt. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b-2 border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-900">Log New Debt</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto hide-scrollbar">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Success!</h3>
              <p className="text-slate-600 mt-2">The debt has been securely logged.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-900">Customer Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full min-h-[56px] px-4 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:ring-0 text-lg transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-900">Phone Number</label>
                <input 
                  type="number"
                  inputMode="decimal"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full min-h-[56px] px-4 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:ring-0 text-lg transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-900">Amount (₦)</label>
                <input 
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full min-h-[56px] px-4 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:ring-0 text-lg transition-all"
                  required
                />
              </div>

              {/* Added padding to prevent keyboard occlusion on mobile */}
              <div className="pt-4 pb-2">
                <Button type="submit" isLoading={isLoading} className="w-full h-14 text-lg hidden sm:flex">
                  Log Debt
                </Button>
                <Button type="submit" isLoading={isLoading} className="w-full h-14 text-lg sm:hidden sticky bottom-0 z-50">
                  Log Debt
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
