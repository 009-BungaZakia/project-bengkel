import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices } from "@/api/service.api";
import { getServiceProgress } from "@/api/progress.api";
import { Clock, Wrench, CheckCircle, MessageSquare, ArrowRight, History, ShoppingBag, Loader2 } from "lucide-react";

// --- KOMPONEN TIMELINE (Disederhanakan & Lebih Informatif) ---
const ServiceTimeline = ({ serviceId }) => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    getServiceProgress(serviceId)
      .then(res => {
        const data = res.data?.data || res.data || [];
        setLogs(Array.isArray(data) ? data : []);
      })
      .catch(() => setLogs([]));
  }, [serviceId]);
  
  if (logs.length === 0) return (
    <p className="mt-4 text-[10px] font-bold text-gray-300 italic uppercase">Menunggu inspeksi mekanik...</p>
  );
  
  return (
    <div className="mt-6 border-t border-gray-50 pt-4">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
        <History size={12} className="text-blue-500" /> Log Pengerjaan Terkini
      </p>
      <div className="space-y-4 ml-2 italic font-medium">
        {logs.slice(0, 2).map((log, idx) => ( // Cukup tampilkan 2 log terakhir agar ringkas
          <div key={log.id} className="relative pl-6 border-l-2 border-blue-100 last:border-transparent pb-1">
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-blue-600 animate-pulse' : 'bg-gray-200'}`} />
            <p className={`text-xs ${idx === 0 ? 'text-gray-800' : 'text-gray-400'}`}>
              {log.description || log.note || "Update status pengerjaan"}
            </p>
            <span className="text-[9px] text-gray-300 block font-normal leading-none mt-1">
              {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CustomerDashboard() {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  // Daftar part tetap hardcoded atau bisa kamu ambil dari API nantinya
  const spareparts = [
    { name: "Oli Mesin SPX 2 (Matic)", price: "Rp 65.000" },
    { name: "Oli Gardan", price: "Rp 15.000" },
    { name: "Kampas Rem Depan", price: "Rp 45.000" },
    { name: "Kampas Rem Belakang", price: "Rp 55.000" },
    { name: "V-Belt Kit (Set)", price: "Rp 185.000" },
    { name: "Filter Udara", price: "Rp 50.000" },
  ];

 const fetchServices = async () => {
  setLoading(true);
  try {
    const res = await getAllServices();
    
    // Perbaikan: Pastikan mengambil array data dengan benar
    // Backend biasanya mengirim { message: "...", data: [...] }
    const rawData = res.data || res; 
    const finalData = Array.isArray(rawData) ? rawData : (rawData.data || []);
    
    // Opsional: Urutkan dari yang terbaru (berdasarkan ID atau tanggal)
    const sortedData = finalData.sort((a, b) => b.id - a.id);
    
    setMyServices(sortedData);
  } catch (err) {
    console.error("Gagal load servis:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-10 pb-20 p-6 max-w-6xl mx-auto min-h-screen bg-gray-50/30">
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" /> Bengkel Online Active
          </p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Selamat Datang <span className="text-blue-600">{user?.name?.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
           <div className="text-right leading-none">
             <p className="text-[10px] font-black text-gray-400 uppercase">Total Servis</p>
             <p className="text-lg font-black text-gray-800">{myServices.length}</p>
           </div>
           <Wrench className="text-blue-500" size={24} />
        </div>
      </header>

      {/* 2. KATALOG HARGA */}
      <section className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-500">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <ShoppingBag className="text-blue-400" size={24} /> Katalog Sparepart
            </h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase border border-slate-800 px-3 py-1 rounded-full">Update 2024</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
            {spareparts.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-800/50 pb-3 group">
                <span className="text-sm text-slate-400 group-hover:text-blue-300 transition-colors font-medium tracking-tight">{item.name}</span>
                <span className="text-sm font-black text-white">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
        <ShoppingBag className="absolute right-[-40px] bottom-[-40px] text-white/5 rotate-12" size={200} />
      </section>

      {/* 3. DAFTAR SERVIS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <Wrench size={14} className="text-blue-600"/> Monitor Servis
            </h2>
            <button onClick={fetchServices} className="text-[10px] font-bold text-blue-600 hover:underline">Refresh Status</button>
        </div>
        
        {loading ? (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center shadow-inner">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={32} />
            <p className="text-gray-400 font-black tracking-widest text-[10px] uppercase">Sinkronisasi Data...</p>
          </div>
        ) : myServices.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
            <Clock className="mx-auto text-gray-200 mb-4" size={56} />
            <h3 className="text-gray-800 font-black uppercase text-sm">Belum Ada Riwayat</h3>
            <p className="text-gray-400 text-xs mt-1">Silahkan datang ke bengkel untuk memulai servis.</p>
          </div>
        ) : (
          myServices.map(srv => (
            <div key={srv.id} className="bg-white p-8 md:p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
               <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      {srv.status === 'completed' || srv.status === 'done' ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 uppercase tracking-tighter">
                          <CheckCircle size={12} /> Unit Selesai
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase tracking-tighter animate-pulse">
                          <Clock size={12} /> {srv.status === 'processing' ? 'Dalam Pengerjaan' : 'Menunggu Antrean'}
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-gray-300">ID: #SRV-{srv.id}</span>
                    </div>
                    
                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter group-hover:text-blue-600 transition-colors">
                        {srv.problem || "Pengecekan Rutin"}
                    </h3>
                    
                    {/* Komponen Timeline Progres */}
                    <ServiceTimeline serviceId={srv.id} />
                  </div>

                  {/* Tombol Konfirmasi (Tampil jika status 'processing' atau butuh approval) */}
                  {(srv.status === 'processing' || srv.status === 'pending_approval') && (
                    <div className="flex items-center justify-center md:justify-end">
                      <Link 
                        to={`/customer/approval/${srv.id}`} 
                        className="group/btn w-full md:w-auto bg-slate-900 text-white px-10 py-6 rounded-3xl font-black text-xs flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 hover:shadow-blue-200 active:scale-95"
                      >
                         <MessageSquare size={18} />
                         <span>KONFIRMASI ESTIMASI</span> 
                         <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform"/>
                      </Link>
                    </div>
                  )}
               </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}