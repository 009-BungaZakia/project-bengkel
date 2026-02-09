import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosConfig";
import { useNavigate } from "react-router-dom"; 
import { 
  Users, 
  Wrench, 
  ClipboardList, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

export default function MechanicDashboard() {
  const navigate = useNavigate(); 
  const [stats, setStats] = useState({
    total_customers: 0,
    pending_services: 0,
    active_services: 0,
    completed_services: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/mechanic/stats");
      setStats(res.data?.data || res.data || stats);
    } catch (err) {
      console.error("Gagal mengambil stats mekanik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Greeting Dinamis
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "SELAMAT PAGI";
    if (hour < 17) return "SELAMAT SIANG";
    return "SELAMAT SORE";
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-blue-600 font-black tracking-tighter uppercase">Menyiapkan Ruang Kerja...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER SECTION WITH CLOCK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs tracking-widest mb-1">
            <LayoutDashboard size={14} /> DASHBOARD MEKANIK
          </div>
          <p className="text-gray-500 font-medium italic">
            "Kualitas kerja hari ini adalah reputasi kita besok."
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Waktu Server</p>
                <p className="text-lg font-mono font-bold text-gray-800">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
             </div>
             <div className="w-[1px] h-8 bg-gray-100"></div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-black text-green-600 uppercase">Online</span>
             </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Customer */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-blue-500 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Users size={24}/></div>
            <TrendingUp size={20} className="text-gray-200" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pelanggan</p>
          <p className="text-4xl font-black mt-1 text-gray-800">{stats.total_customers}</p>
        </div>

        {/* Card Antrean (Navigasi ke /mekanik/job-assignment) */}
        <div 
          onClick={() => navigate("/mekanik/job-assignment")} 
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-orange-500 transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all"><AlertCircle size={24}/></div>
            <Clock size={20} className="text-gray-200" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Antrean Servis</p>
          <p className="text-4xl font-black mt-1 text-gray-800">{stats.pending_services}</p>
          {stats.pending_services > 0 && (
            <div className="absolute top-4 right-4 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </div>
          )}
        </div>

        {/* Card Proses */}
        <div 
          onClick={() => navigate("/mekanik/job-assignment")}
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-emerald-500 transition-all duration-300 cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><Wrench size={24}/></div>
            <ArrowRight size={20} className="text-gray-200" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sedang Dikerjakan</p>
          <p className="text-4xl font-black mt-1 text-gray-800">{stats.active_services}</p>
        </div>

        {/* Card Selesai */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-purple-500 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all"><ClipboardList size={24}/></div>
            <TrendingUp size={20} className="text-gray-200" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Servis Selesai</p>
          <p className="text-4xl font-black mt-1 text-gray-800">{stats.completed_services}</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-gray-900 p-8 rounded-[3rem] shadow-2xl shadow-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm">
            <Wrench className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Tugas Baru Tersedia?</h3>
            <p className="text-gray-400 text-sm">Cek antrean kendaraan dan mulai pengerjaan sekarang juga.</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate("/mekanik/job-assignment")}
          className="w-full md:w-auto px-10 py-5 bg-white text-gray-900 rounded-[1.5rem] font-black hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 group active:scale-95 shadow-xl shadow-black/20 relative z-10"
        >
          LIHAT TUGAS SAYA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}