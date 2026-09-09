import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileUp, FileCheck, ShieldCheck, Map as MapIcon, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // Used for the logout redirect

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: "Upload Record", path: "/dashboard/upload", icon: <FileUp className="w-5 h-5 mr-3" /> },
    { name: "Verification", path: "/dashboard/verification", icon: <FileCheck className="w-5 h-5 mr-3" /> },
    { name: "GIS Viewer", path: "/dashboard/map", icon: <MapIcon className="w-5 h-5 mr-3" /> },
  ];

  const handleLogout = () => {
    // 1. Destroy the session token
    localStorage.removeItem('auth_token');
    
    // 2. Force navigation back to the login screen, replacing the history
    // so the user can't use the back button to return to the dashboard
    navigate('/', { replace: true });
  };

  return (
    <aside className="w-64 bg-[#3E2723] text-white flex flex-col h-full shadow-2xl z-20 relative">
      
      {/* Top Border Gradient */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"></div>

      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-[#5D4037]">
        <div className="relative w-12 h-12 bg-[#2D1B15] rounded-full flex items-center justify-center">
          <div className="absolute inset-[3px] rounded-full border-[1.5px] border-dashed border-yellow-500/50"></div>
          <ShieldCheck className="w-5 h-5 text-yellow-400 relative z-10" strokeWidth={2.5} />
        </div>
        <div className="ml-3">
          <h1 className="text-sm font-bold tracking-wider">LandRecord AI</h1>
          <p className="text-[9px] text-yellow-500 uppercase tracking-widest font-semibold">Govt. Prototype</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => {
          // Logic to keep the tab highlighted even if we are on a nested route (like record/:id)
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-stone-300 hover:bg-[#4E342E] hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#5D4037]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-3 rounded-md text-sm font-bold text-stone-300 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Secure Logout
        </button>
      </div>

    </aside>
  );
}