import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestSparepart } from "@/api/mekanik.api";
import { AlertTriangle, Send, ArrowLeft, PackagePlus } from "lucide-react";

export default function RequestApproval() {
  const { id } = useParams(); // ID Servis
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    estimated_price: "",
    reason: ""
  });

 // Update pada fungsi handleRequest di komponenmu
const handleRequest = async (e) => {
  e.preventDefault();
  
  // Validasi tambahan: harga tidak boleh nol atau negatif
  if (parseFloat(formData.estimated_price) <= 0) {
    return alert("Harga estimasi harus lebih dari 0!");
  }

  setLoading(true);
  try {
    // Pastikan payload dikirim dengan tipe data yang benar
    const payload = {
      ...formData,
      estimated_price: parseFloat(formData.estimated_price)
    };

    await requestSparepart(id, payload);
    alert("Permintaan berhasil dikirim! Menunggu konfirmasi Admin/Customer.");
    navigate(-1);
  } catch (err) {
    // Menampilkan pesan error dari backend jika ada
    const errorMsg = err.response?.data?.message || "Terjadi kesalahan server";
    alert("Gagal mengirim: " + errorMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6">
        <ArrowLeft size={20} /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-amber-500 p-6 text-white flex items-center gap-3">
          <AlertTriangle size={32} />
          <div>
            <h1 className="text-xl font-bold">Request Sparepart Tambahan</h1>
            <p className="text-amber-100 text-sm">Butuh persetujuan untuk penggantian komponen baru</p>
          </div>
        </div>

        <form onSubmit={handleRequest} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Sparepart / Jasa</label>
            <div className="relative">
              <PackagePlus className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: Kampas Rem Belakang"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Estimasi Harga (Rp)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Contoh: 150000"
              value={formData.estimated_price}
              onChange={(e) => setFormData({ ...formData, estimated_price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Alasan Penggantian</label>
            <textarea
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
              placeholder="Contoh: Komponen sudah aus dan berisiko jika tidak diganti"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : <><Send size={18} /> Kirim ke Admin</>}
          </button>
        </form>
      </div>
    </div>
  );
}