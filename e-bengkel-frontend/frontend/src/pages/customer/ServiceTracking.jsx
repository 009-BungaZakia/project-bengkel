import React, { useState, useEffect } from "react";
import { getServiceProgress } from "@/api/service.api";
import { CheckCircle2, Clock, Wrench, AlertCircle, Loader2 } from "lucide-react";

export default function ServiceTracking() {
  const [activeService, setActiveService] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Logika untuk mengambil data progres dari API
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await getServiceProgress(); 
        // Sesuaikan dengan response backend-mu (misal: data servis yang statusnya belum 'selesai')
        setActiveService(res.data || res);
      } catch (err) {
        console.error("Gagal memuat progres:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return (
    <div className="flex justify-center p-20 text-gray-400 font-medium">
      <Loader2 className="animate-spin mr-2" /> Memantau motor Anda...
    </div>
  );

  if (!activeService) return (
    <div className="p-10 text-center text-gray-500 italic">
      Tidak ada servis yang sedang berjalan.
    </div>
  );

  // 2. Status mapping untuk highlight progress bar
  const steps = [
    { label: "Antrean", status: "pending", icon: <Clock /> },
    { label: "Dikerjakan", status: "processing", icon: <Wrench /> },
    { label: "Selesai", status: "selesai", icon: <CheckCircle2 /> }
  ];

  // Cari index posisi progres saat ini
  const currentStepIndex = steps.findIndex(s => s.status === activeService.status);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tracking Servis</h1>
      
      {/* Informasi Kendaraan */}
      <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Kendaraan Sedang Diservis</p>
        <h2 className="text-xl font-bold mt-1">{activeService.vehicle_name}</h2>
        <p className="text-blue-400 font-mono">{activeService.plate_number}</p>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
        <div className="flex justify-between items-center relative">
          {/* Garis Progress */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 translate-y-[-50%]"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
              <div className={`p-3 rounded-full transition-all duration-500 ${
                idx <= currentStepIndex ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase ${
                idx <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifikasi Approval (Hanya muncul jika ada request sparepart) */}
      {activeService.needs_approval && (
        <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-2xl flex items-start gap-4 animate-pulse">
          <AlertCircle className="text-amber-600 shrink-0" size={28} />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Butuh Persetujuan Anda!</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Mekanik memerlukan <b>{activeService.part_name}</b> seharga <b>Rp {activeService.part_price?.toLocaleString()}</b>.
            </p>
            <div className="flex gap-3 mt-4">
              <button className="bg-amber-600 text-white text-xs px-5 py-2 rounded-xl font-bold hover:bg-amber-700 transition-all">Setujui</button>
              <button className="bg-white border border-amber-300 text-gray-600 text-xs px-5 py-2 rounded-xl font-bold hover:bg-gray-50">Tolak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}