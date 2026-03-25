import { useState } from "react";
import Signin from "../signin/Signin";
import Signup from "../signup/Signup";
import CreditCardIcon from "../../components/CreditCardIcon";
import AuthSelector from "../../components/AuthSelector";


const Auth = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border-[4px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-2xl overflow-hidden p-2">
          {/* Card Header */}
          <div className="px-6 pt-10 pb-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#fbbf24] border-[3px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-2xl flex items-center justify-center mb-6 text-slate-900">
              <CreditCardIcon />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">KreditKard</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2 px-8">
              Digitizing Nigeria's informal credit economy
            </p>
          </div>

          {/* Tab Selector */}
          <div className="px-6 py-4">
            <AuthSelector activePage={activeTab} onSelect={setActiveTab} />
          </div>

          {/* Form Area */}
          <div className="px-6 pb-10 pt-4">
            {activeTab === "signin" ? <Signin /> : <Signup />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 text-center">
        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
          © 2026 KreditKard • Built for the Market
        </p>
      </footer>
    </div>
  );
};

export default Auth;
