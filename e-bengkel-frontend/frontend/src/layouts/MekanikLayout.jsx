import React from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, User, LogOut } from "lucide-react";

export default function MekanikLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Mekanik */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-blue-400 text-center">Halaman Mekanik</h1>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => navigate("/mekanik/dashboard")} className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-all">
            <Wrench size={20} /> Daftar Kerja
          </button>
          <button onClick={() => navigate("/mekanik/profile")} className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-all">
            <User size={20} /> Profil Saya
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button onClick={() => {localStorage.clear(); navigate("/login");}} className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 rounded-lg">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}