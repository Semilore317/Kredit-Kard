import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { Link } from "react-router";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

export default function Settings() {
  const [merchantId, setMerchantId] = useState("IKIA9C...");
  const [vaPrefix, setVaPrefix] = useState("9854");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedMid = localStorage.getItem("interswitch_merchant_id");
    const savedPrefix = localStorage.getItem("interswitch_va_prefix");
    if (savedMid) setMerchantId(savedMid);
    if (savedPrefix) setVaPrefix(savedPrefix);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("interswitch_merchant_id", merchantId);
    localStorage.setItem("interswitch_va_prefix", vaPrefix);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b-[3px] border-slate-900 px-4 py-4 flex items-center sticky top-0 z-30">
        <Link to="/dashboard" className="p-2 -ml-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors mr-3">
          <ArrowLeft className="w-6 h-6 stroke-[3px]" />
        </Link>
        <h1 className="text-xl font-black tracking-tight uppercase">Settings</h1>
      </header>

      <main className="p-4 sm:p-6 max-w-lg mx-auto mt-4">
        <div className="bg-white border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
            Interswitch Configuration
          </h2>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-slate-700 text-sm uppercase tracking-wide">Merchant ID</label>
              <input 
                type="text" 
                value={merchantId}
                onChange={e => setMerchantId(e.target.value)}
                className="w-full min-h-[56px] px-4 rounded-xl border-2 border-slate-300 focus:border-slate-900 focus:ring-0 text-slate-900 font-mono text-lg transition-all"
                placeholder="IKIA..."
              />
              <p className="text-xs text-slate-500 font-medium">Provided by the Interswitch Sandbox Portal.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-slate-700 text-sm uppercase tracking-wide">M-Cash VA Prefix</label>
              <input 
                type="text" 
                value={vaPrefix}
                onChange={e => setVaPrefix(e.target.value)}
                className="w-full min-h-[56px] px-4 rounded-xl border-2 border-slate-300 focus:border-slate-900 focus:ring-0 text-slate-900 font-mono text-lg transition-all"
                placeholder="0000"
              />
            </div>

            <div className="pt-4 border-t-2 border-slate-100 mt-2">
              {isSaved ? (
                <Button disabled className="w-full bg-green-500 hover:bg-green-500 border-none flex items-center gap-2 text-white shadow-none">
                  <CheckCircle className="w-6 h-6" />
                  Saved
                </Button>
              ) : (
                <Button type="submit" className="w-full flex items-center gap-2 shadow-[4px_4px_0px_#cbd5e1]">
                  <Save className="w-5 h-5" />
                  Save Settings
                </Button>
              )}
            </div>
          </form>
        </div>
        
        <div className="text-center px-6">
          <p className="text-sm font-bold text-slate-400">KreditKard Merchant App v1.0.0</p>
          <p className="text-xs font-medium text-slate-400 mt-1">Interswitch x Enyata Hackathon Edition</p>
        </div>
      </main>
    </div>
  );
}
