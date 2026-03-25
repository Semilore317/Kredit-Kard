import { Bell, Zap, CreditCard } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center gap-4 px-6 py-3">
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
        {/* Demo button */}
        <button className="flex items-center gap-1.5 bg-brand-primary-500 hover:bg-brand-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Zap className="w-4 h-4" />
          Demo
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <CreditCard className="w-4 h-4 text-slate-500" />
          Mama Tola Stores
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
