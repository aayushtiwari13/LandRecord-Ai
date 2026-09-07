import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-orange-200 flex items-center justify-between px-8 shadow-sm z-10">
      <div className="flex items-center">
         <h2 className="text-lg font-bold text-[#4E342E]">
           Land Record Digitization & Validation System
         </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-[#3E2723]">Tehsildar</span>
          <span className="text-xs text-orange-600 font-medium">Ashish Kumar Jha</span>
        </div>
        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-300">
          <User className="w-5 h-5 text-orange-700" />
        </div>
      </div>
    </header>
  );
}