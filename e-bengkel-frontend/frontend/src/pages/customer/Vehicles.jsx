import React, { useEffect, useState } from "react";
import { getAllServices } from "@/api/service.api";
import { Car, Wrench, Clock, AlertCircle, Loader2 } from "lucide-react";

export default function CustomerVehicles() {
  const [activeServices, setActiveServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllServices();
        
        // Menangani berbagai kemungkinan struktur response API
        const data = res.data?.data || res.data || [];
        
        // Filter: Kita sembunyikan yang sudah 'done' atau 'completed'
        // Karena ini halaman "Kendaraan Aktif"
        const filtered = data.filter(s => 
          s.status !== "done" && 
          s.status !== "completed" && 
          s.status !== "rejected"
        );
        
        setActiveServices(Array.isArray(filtered) ? filtered : []);
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil data servis:", err);
        setError("Gagal terhubung ke server. Pastikan Anda sudah login.");
      } finally {
        setLoading(false); // Pastikan loading berhenti apapun yang terjadi
      }
    };

    fetchData();
  }, []);

  // Tampilan Loading yang lebih halus (Skeleton-like)
  if (loading) return (
    <div className="p-10 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Sinkronisasi Data...</p>
    </div>
  );

  // Tampilan jika Error
  if (error) return (
    <div className="p-10 text-center">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <p className="text-gray-600 font-bold">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 text-blue-600 font-black text-xs uppercase underline"
      >
        Coba Lagi
      </button>
    </div>
  );

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <header>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Live Monitoring</p>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Active Units</h1>
        <p className="text-slate-500 font-medium">Unit yang sedang dalam penanganan tim mekanik kami.</p>
      </header>

      {activeServices.length === 0 ? (
        <div className="bg-white p-20 rounded-[48px] border-2 border-dashed border-slate-100 text-center shadow-inner">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="text-slate-200" size={48} />
          </div>
          <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">Garasi Kosong</h3>
          <p className="text-slate-400 text-xs mt-1 font-medium">Tidak ada kendaraan yang sedang diservis saat ini.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeServices.map(srv => (
            <div key={srv.id} className="group bg-white p-8 rounded-[40px] border border-slate-50 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
                <Car size={40} />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-slate-300">#SRV-{srv.id}</span>
                  <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-full uppercase italic border border-blue-100">
                    {srv.status}
                  </span>
                </div>
                
                <h3 className="font-black text-slate-800 text-2xl tracking-tight capitalize group-hover:text-blue-600 transition-colors">
                  {srv.problem || "Pengecekan Umum"}
                </h3>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <Wrench size={14} className="text-blue-500"/> 
                    {srv.Mekanik?.name || srv.mechanic_name || "Assigning..."}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-500"/> 
                    Est. Terkini
                  </span>
                </div>
              </div>

              <div className="w-full md:w-px h-px md:h-12 bg-slate-100" />

              <div className="px-4 text-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Status Progres</p>
                 <p className="text-sm font-black text-blue-600 italic">ON_WORK</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}