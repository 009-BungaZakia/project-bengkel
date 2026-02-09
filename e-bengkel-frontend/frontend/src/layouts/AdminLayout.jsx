import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ClipboardList, 
  FileText, 
  LogOut,
  Menu,
  X 
} from "lucide-react";


export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
  { 
    name: "Dashboard", 
    path: "/admin/dashboard", 
    icon: <LayoutDashboard size={20} /> 
  },
  { 
    name: "Data Pelanggan", // Ganti dari "Kelola User"
    path: "/admin/customers", // Ganti path-nya agar sinkron
    icon: <Users size={20} /> 
  },
  { 
    name: "Antrean Servis", 
    path: "/admin/services", 
    icon: <ClipboardList size={20} /> 
  },
  { 
    name: "Laporan Transaksi", 
    path: "/admin/transactions", 
    icon: <FileText size={20} /> 
  },
];
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          {isSidebarOpen && <span className="font-bold text-xl text-blue-400">Halaman Admin</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex items-center gap-4 p-3 hover:bg-blue-600 rounded-lg transition-colors group"
            >
              <span className="text-slate-400 group-hover:text-white">{item.icon}</span>
              {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 flex justify-between items-center shadow-sm">
          <h2 className="font-semibold text-gray-700 uppercase tracking-wider text-sm">Sistem Manajemen E-Bengkel</h2>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{user?.name || "Administrator"}</p>
              <p className="text-xs text-blue-600 font-medium">Big Admin</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}