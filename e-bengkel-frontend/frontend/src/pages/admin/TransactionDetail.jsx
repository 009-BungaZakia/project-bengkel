import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as ServiceAPI from "@/api/service.api";
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await ServiceAPI.getServiceById(id);
        setData(res?.data || res);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-20 text-center font-black uppercase">Memuat Nota...</div>;
  if (!data) return <div className="p-20 text-center font-black uppercase text-red-500">Nota Tidak Ditemukan!</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Tombol Navigasi (Hilang saat cetak) */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-black">
          <ArrowLeft size={20} /> KEMBALI
        </button>
        <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-blue-100 uppercase text-xs">
          <Printer size={18} /> Cetak Nota
        </button>
      </div>

      {/* Area Nota (Yang akan dicetak) */}
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
        <div className="text-center space-y-2 mb-8 border-b pb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-blue-600">BENGKEL JAYA</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jl. Raya Otomotif No. 123, Indonesia</p>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Pelanggan</p>
            <p className="font-bold text-gray-800">{data.Customer?.nama || data.customer_name}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase">No. Antrean</p>
            <p className="font-black text-xl italic text-gray-800">#{data.id}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Detail Kendaraan</p>
            <p className="font-bold">{data.Vehicle?.plat_nomor} - {data.Vehicle?.merk} {data.Vehicle?.model}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Keluhan / Perbaikan</p>
            <p className="font-medium text-gray-600 italic">"{data.description}"</p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-8">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
            <div className="flex items-center gap-1 text-emerald-600 font-black uppercase text-xs">
              <CheckCircle2 size={14} /> LUNAS / SELESAI
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase">Tanggal</p>
            <p className="font-bold text-gray-800">{new Date(data.created_at).toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        <div className="mt-12 text-center border-t border-dashed pt-8">
          <p className="text-[10px] font-black text-gray-400 uppercase">Terima kasih telah mempercayakan kendaraan Anda!</p>
        </div>
      </div>
    </div>
  );
}