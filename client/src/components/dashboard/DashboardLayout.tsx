import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
