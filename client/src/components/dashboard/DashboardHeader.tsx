import { CreditCard, Menu, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router";

const DashboardHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const businessName = useSelector((state: RootState) => state.auth.trader?.business_name || "Loading...");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center gap-4 px-4 md:px-6 py-3">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 mr-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center"
        aria-label="Open Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        {/* Business name */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <CreditCard className="w-4 h-4 text-slate-500" />
          {businessName}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;

