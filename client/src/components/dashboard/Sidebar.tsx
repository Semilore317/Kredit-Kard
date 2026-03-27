import { NavLink } from "react-router";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  ArrowLeftRight,
  MessageSquare,
  Settings,
} from "lucide-react";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/debts", label: "Debts", icon: CreditCard },
  { to: "/app/customers", label: "Customers", icon: Users },
  { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/app/messages", label: "Messages", icon: MessageSquare },
];

const Sidebar = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative top-0 left-0 z-50 h-[100dvh] md:h-screen w-[80vw] sm:w-[350px] md:w-64 bg-white md:bg-[#f5f6f7] flex flex-col border-r border-slate-200 shrink-0 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-200">
        <CreditCard className="w-5 h-5 text-brand-primary-500" />
        <span className="text-xl font-extrabold">
          <span className="text-slate-900">Kredit</span>
          <span className="text-brand-primary-500">Kard</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 pt-6 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-primary-50 text-brand-primary-500"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary-500" : "text-slate-500"}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  );
};

export default Sidebar;
