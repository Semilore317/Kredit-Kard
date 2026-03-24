import { useState } from "react";
import Signin from "../signin/Signin";
import Signup from "../signup/Signup";
import CreditCardIcon from "../../components/CreditCardIcon";
import AuthSelector from "../../components/AuthSelector";


const Auth = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: "linear-gradient(135deg, #fde8df 0%, #fce4ec 30%, #e8eaf6 65%, #e3f2fd 100%)" }}>


      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-4 py-8 sm:py-12">
        <div className="w-full max-w-md glassmorphism bg-white rounded-2xl shadow-lg shadow-blue-100/60 border border-slate-100 overflow-hidden px-3 pb-3">
          {/* Card Header */}
          <div className="px-4 sm:px-8 pt-6 sm:pt-8  sm:pb-6 pb-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-brand-primary-50 rounded-2xl flex items-center justify-center mb-4 text-brand-primary-500">
              <CreditCardIcon />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome to KreditKard</h1>
            <p className="text-[11px] text-slate-400">Sign in to manage your credit records</p>
          </div>

          {/* Tab Selector */}
          <div className="px-4 sm:px-8 pb-2">
            <AuthSelector activePage={activeTab} onSelect={setActiveTab} />
          </div>

          {/* Form Area */}
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            {activeTab === "signin" ? <Signin /> : <Signup />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-slate-400">
        © 2026 KreditKard. Digitizing Nigeria's informal credit economy.
      </footer>
    </div>
  );
};

export default Auth;
