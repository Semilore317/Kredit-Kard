import { CreditCard, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const DashboardHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const businessName = useSelector((state: RootState) => state.auth.trader?.business_name || "Loading...");

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center gap-4 px-4 md:px-6 py-3">
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 mr-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center"
        aria-label="Open Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      {/* <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div> */}


      <div className="ml-auto flex items-center gap-3">
        {/* User */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <CreditCard className="w-4 h-4 text-slate-500" />
          {businessName}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
