import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="h-[calc(100%-60px)] bg-primary-100 dark:bg-secondary-700 p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
