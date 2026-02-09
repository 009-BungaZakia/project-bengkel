import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById, approveService } from "@/api/service.api";
import { CheckCircle, XCircle, AlertTriangle, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

// ... (bagian import tetap sama)

export default function CustomerApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sinkronisasi: Pastikan mengambil detail termasuk items
    getServiceById(id)
      .then(res => {
        // Karena backend biasanya membungkus dalam { success: true, data: ... }
        const data = res.data || res;
        setService(data);
      })
      .catch(err => console.error("Error fetching detail:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (status) => {
    // Sesuaikan payload dengan ekspektasi backend (approveService)
    if (!window.confirm(`Yakin ingin ${status === 'approved' ? 'MENYETUJUI' : 'MENOLAK'} estimasi ini?`)) return;

    try {
      // Backend kita membutuhkan 'status' untuk update kolom status
      await approveService(id, { 
        status: status, // 'approved' atau 'rejected'
        note: status === 'approved' ? 'Disetujui pelanggan' : 'Ditolak pelanggan'
      });
      alert(`Estimasi berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
      navigate("/customer/dashboard");
    } catch (err) {
      alert("Gagal memperbarui status. Pastikan koneksi server aman.");
    }
  };

  // Helper untuk format rupiah agar tampilan profesional
  const formatIDR = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0);

  // ... (tampilan loading tetap sama)

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20 space-y-8">
      {/* ... (tombol kembali) ... */}

      <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-50">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Service Estimation</p>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">
                #{service?.id} - {service?.description || 'Pengecekan Umum'}
              </h1>
            </div>
            <ShieldCheck size={32} className="text-blue-400" />
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Detail Items dari Backend */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Rincian Part & Jasa</h3>
            <div className="space-y-3">
              {/* Loop data items dari backend */}
              {service?.items && service.items.length > 0 ? (
                service.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm font-bold text-gray-600">
                    <span>{item.item_name} (x{item.quantity})</span>
                    <span>{formatIDR(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 italic">Belum ada rincian sparepart tambahan.</div>
              )}
              
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-xl font-black text-gray-900 tracking-tighter">
                <span>ESTIMASI TOTAL</span>
                <span className="text-blue-600">
                  {/* Hitung total jika total_price tidak tersedia langsung */}
                  {formatIDR(service?.total_price || (service?.items || []).reduce((acc, curr) => acc + (curr.price * curr.quantity), 0))}
                </span>
              </div>
            </div>
          </div>

          {/* ... (tombol aksi Setujui/Tolak) ... */}
        </div>
      </div>
    </div>
  );
}