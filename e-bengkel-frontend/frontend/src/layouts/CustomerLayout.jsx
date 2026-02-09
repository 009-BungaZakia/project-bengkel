import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Car, History, Home, User } from "lucide-react";

export default function CustomerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Helper untuk menandai menu aktif (Sesuaikan dengan path di App.jsx)
  const isActive = (path) => location.pathname === path 
    ? "bg-white/20 text-white shadow-inner" 
    : "text-blue-100 hover:text-white hover:bg-white/10";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 md:pb-0">
      {/* Navbar Modern */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg text-blue-600 font-black shadow-sm">EB</div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">E-Bengkel</h1>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex gap-2 items-center bg-blue-700/30 p-1.5 rounded-2xl border border-blue-500/30">
            <Link to="/customer/dasboard" className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${isActive('/customer/dasboard')}`}>
              <Home size={18}/> Dashboard
            </Link>
            <Link to="/customer/vehicles" className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${isActive('/customer/vehicles')}`}>
              <Car size={18}/> Kendaraan
            </Link>
            <Link to="/customer/history" className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${isActive('/customer/history')}`}>
              <History size={18}/> Riwayat
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-blue-200 uppercase leading-none">Customer</p>
              <p className="text-sm font-bold">{user?.name?.split(' ')[0]}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-white/10 hover:bg-red-500 p-2.5 rounded-xl transition-all border border-white/20 group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header Sapaan */}
        <header className="mb-8 px-2">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Overview</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Halo, {user?.name}! </h2>
        </header>

        {children}
      </main>

      {/* Navbar Mobile (Muncul di layar kecil) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
        <Link to="/customer/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/customer/dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Home size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link to="/customer/vehicles" className={`flex flex-col items-center gap-1 ${location.pathname === '/customer/vehicles' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Car size={20} />
          <span className="text-[10px] font-bold">Motor</span>
        </Link>
        <Link to="/customer/history" className={`flex flex-col items-center gap-1 ${location.pathname === '/customer/history' ? 'text-blue-600' : 'text-slate-400'}`}>
          <History size={20} />
          <span className="text-[10px] font-bold">Riwayat</span>
        </Link>
      </div>
    </div>
  );
}