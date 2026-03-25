import { useState } from "react";

const Settings = () => {
  const [business, setBusiness] = useState({
    name: "Tolani Adeyemi",
    businessName: "Mama Tola Stores",
    phone: "08031234567",
    market: "Alaba International Market, Lagos",
  });

  const [payout, setPayout] = useState({
    bankName: "First Bank",
    accountNumber: "3021456789",
    accountName: "Tolani Adeyemi",
  });

  const handleBusiness = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusiness((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayout((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>

      {/* Business Profile */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-slate-900">Business Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Your Name</label>
            <input
              name="name"
              value={business.name}
              onChange={handleBusiness}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Business Name</label>
            <input
              name="businessName"
              value={business.businessName}
              onChange={handleBusiness}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Phone</label>
            <input
              name="phone"
              value={business.phone}
              onChange={handleBusiness}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Market</label>
            <input
              name="market"
              value={business.market}
              onChange={handleBusiness}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Payout Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-slate-900">Payout Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Bank Name</label>
            <input
              name="bankName"
              value={payout.bankName}
              onChange={handlePayout}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Account Number</label>
            <input
              name="accountNumber"
              value={payout.accountNumber}
              onChange={handlePayout}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Account Name</label>
            <input
              name="accountName"
              value={payout.accountName}
              onChange={handlePayout}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-primary-400"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
