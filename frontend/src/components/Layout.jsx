import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-orange-50/30 text-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {/* Yahan baaki ke pages (Dashboard, Upload) render honge */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}