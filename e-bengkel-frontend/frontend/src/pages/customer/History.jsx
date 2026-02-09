import React, { useEffect, useState } from "react";
import { getAllServices } from "@/api/service.api";
import { CheckCircle, FileText, Calendar, ChevronRight, Search, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllServices()
      .then(res => {
        const data = res.data?.data || res.data || [];
        // Filter status 'done' atau 'completed' sesuai standar sistemmu
        const finished = data.filter(s => s.status === "done" || s.status === "completed");
        setHistory(finished);
      })
      .catch(() => console.error("Gagal memuat riwayat"))
      .finally(() => setLoading(false));
  }, []);

  // Filter pencarian sederhana berdasarkan masalah kendaraan
  const filteredHistory = history.filter(srv => 
    srv.problem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Membuka Arsip...</p>
    </div>
  );

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">RIWAYAT_SERVIS</h1>
          <p className="text-slate-500 font-medium italic">Track record perawatan kendaraan Anda.</p>
        </div>
        
        {/* Search Bar Mini */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Cari servis..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {history.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-slate-100 text-center shadow-inner">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-slate-200" size={40} />
          </div>
          <h3 className="font-black text-slate-800 uppercase tracking-tight">Belum Ada Data</h3>
          <p className="text-slate-400 text-sm mt-1">Servis yang sudah selesai akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredHistory.map(srv => (
            <div 
              key={srv.id} 
              className="group bg-white p-6 rounded-[32px] border border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase">#{srv.id}</span>
                    <h3 className="font-black text-slate-800 text-lg tracking-tight capitalize">{srv.problem}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(srv.updated_at || srv.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Receipt size={12}/> Lunas</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                <Link 
                  // PERBAIKAN: Gunakan rute khusus customer untuk invoice
                  to={`/customer/invoice/${srv.id}`} 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all shadow-lg shadow-slate-100"
                >
                  <FileText size={14} /> LIHAT INVOICE
                </Link>
                <div className="hidden md:block text-slate-200 group-hover:text-blue-200 transition-colors">
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="bg-blue-600 p-8 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-black text-xl italic uppercase tracking-tighter leading-none">Butuh bantuan?</h4>
          <p className="text-blue-100 text-xs mt-2 font-medium">Jika ada masalah dengan servis sebelumnya, hubungi CS kami.</p>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-8 py-3 rounded-xl font-black text-[10px] hover:bg-slate-50 transition-all uppercase tracking-widest">
          Hubungi Admin
        </button>
        <FileText className="absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12" size={120} />
      </div>
    </div>
  );
}