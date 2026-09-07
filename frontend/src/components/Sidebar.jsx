import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileUp, FileCheck, Landmark, ShieldCheck,FileBox } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { name: "Upload Record", path: "/upload", icon: <FileUp className="w-5 h-5 mr-3" /> },
    { name: "Verification", path: "/verification", icon: <FileCheck className="w-5 h-5 mr-3" /> },
  ];

  return (
    <aside className="w-64 bg-[#3E2723] text-white flex flex-col shadow-2xl z-20 relative">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"></div>
      
      <div className="h-20 flex items-center px-6 border-b border-[#5D4037]">
        <FileBox color="#ce913b" strokeWidth={2.25} />
        <div>
          <h1 className="text-xl font-bold tracking-wide text-orange-50">BHUMI AI</h1>
          <p className="text-[10px] text-yellow-500/80 uppercase tracking-widest font-semibold">Govt. of India Prototype</p>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-orange-600 text-white shadow-md border-l-4 border-yellow-400" 
                  : "text-[#D7CCC8] hover:bg-[#4E342E] hover:text-white border-l-4 border-transparent"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 bg-[#4E342E] rounded-lg border border-[#5D4037] flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-white">Secure Portal</p>
          <p className="text-[10px] text-[#BCAAA4]">End-to-end encrypted validation</p>
        </div>
      </div>
    </aside>
  );
}