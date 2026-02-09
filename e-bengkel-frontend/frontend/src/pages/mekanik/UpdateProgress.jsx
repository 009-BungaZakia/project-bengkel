import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMechanicJobs, updateJobStatus } from "@/api/mekanik.api.js"; // Pastikan fungsi ini ada di API kamu
import { ArrowLeft, Save, CheckCircle, Clock, MessageSquare, Loader2 } from "lucide-react";

export default function UpdateProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    status: "processing",
    note: ""
  });

  // (Opsional) Ambil data lama jika ingin menampilkan info kendaraan
  useEffect(() => {
    // Jika kamu ingin menampilkan detail kendaraan di atas form
    // fetchDetailService(id);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.note.trim()) return alert("Berikan catatan pengerjaan agar customer mendapat info yang jelas!");

    setLoading(true);
    try {
      // Mengirimkan status dan note ke backend
      await updateJobStatus(id, {
        status: formData.status,
        note: formData.note
      });
      
      alert("Laporan progres berhasil diperbarui!");
      navigate("/mekanik/job-assignment");
    } catch (err) {
      alert("Gagal update progres: " + (err.response?.data?.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen">
      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-bold transition-all group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        KEMBALI KE DAFTAR TUGAS
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        {/* Header Header */}
        <div className="bg-gray-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-400 font-black text-xs tracking-[0.2em] mb-1">SERVICE UPDATE</p>
            <h1 className="text-2xl font-black italic">UNIT_ID: #{id}</h1>
          </div>
          <Clock className="absolute right-[-10px] top-[-10px] text-white/5" size={120} />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Pilih Status dengan UI yang lebih interaktif */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Status Pekerjaan Saat Ini
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "processing" })}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                  formData.status === "processing" 
                  ? "border-blue-600 bg-blue-50 text-blue-600 shadow-inner" 
                  : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                }`}
              >
                <Clock size={24} />
                <span className="font-black text-xs">ON_PROGRESS</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "completed" })}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                  formData.status === "completed" 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-inner" 
                  : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                }`}
              >
                <CheckCircle size={24} />
                <span className="font-black text-xs">FINISHED</span>
              </button>
            </div>
          </div>

          {/* Catatan Detail */}
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Laporan Hasil Analisa
              </label>
              <MessageSquare size={14} className="text-gray-300" />
            </div>
            <textarea
              required
              className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 outline-none min-h-[180px] font-medium text-gray-700 transition-all placeholder:text-gray-300 shadow-inner"
              placeholder="Jelaskan apa saja yang sudah dikerjakan atau jika ada temuan kerusakan baru..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            ></textarea>
          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {loading ? "MENGIRIM LAPORAN..." : "KONFIRMASI UPDATE"}
          </button>
        </form>
      </div>
    </div>
  );
}