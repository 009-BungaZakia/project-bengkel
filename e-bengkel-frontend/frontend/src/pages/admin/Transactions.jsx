import React, { useEffect, useState, useRef } from "react";
import { Download, Loader2, FileText, Search, Printer, CheckCircle2 } from "lucide-react";
import { getAllTransactions } from "@/api/transaction.api"; 
import { useReactToPrint } from "react-to-print";
import InvoicePrint from "@/pages/admin/InvoicePrint"; 

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false); // State untuk loading cetak
  const [filterText, setFilterText] = useState("");
  const [selectedTrx, setSelectedTrx] = useState(null);
  const componentRef = useRef();

  // 1. Fungsi Cetak
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${selectedTrx?.id}`,
    onAfterPrint: () => setIsPrinting(false), // Matikan loading setelah print selesai
  });

  const triggerPrint = (trx) => {
    setSelectedTrx(trx);
    setIsPrinting(true);
    // Jeda agar data sempat masuk ke komponen InvoicePrint sebelum di-capture
    setTimeout(() => {
      handlePrint();
    }, 1000);
  };

  // 2. Fetch Data
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await getAllTransactions();
        setTransactions(res.data || res || []);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // 3. Helper Formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // 4. Filter Logic
  const filteredData = transactions.filter((trx) => {
    const name = (trx.customer_name || trx.user?.name || "").toLowerCase();
    const id = trx.id.toString();
    return name.includes(filterText.toLowerCase()) || id.includes(filterText);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-white">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Menyinkronkan_Data_Transaksi...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 italic uppercase text-slate-900">
            <div className="p-2 bg-blue-600 rounded-xl text-white not-italic">
              <FileText size={28} />
            </div>
            Trans_Log
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Kelola invoice dan pantau histori transaksi bengkel.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari ID atau Nama Pelanggan..."
            className="w-full pl-12 pr-4 py-4 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white font-bold text-sm shadow-sm placeholder:text-slate-300"
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.25em] font-black">
              <tr>
                <th className="px-8 py-6">Reference_ID</th>
                <th className="px-8 py-6">Pelanggan</th>
                <th className="px-8 py-6">Tanggal_Masuk</th>
                <th className="px-8 py-6">Total_Billing</th>
                <th className="px-8 py-6 text-center">Aksi_Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-32 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                    Kosong_Data_Tidak_Ditemukan
                  </td>
                </tr>
              ) : (
                filteredData.map((trx) => (
                  <tr key={trx.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6 font-black text-blue-600 italic tracking-tighter">
                      #TRX-{trx.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 uppercase text-xs tracking-tight">
                        {trx.customer_name || trx.user?.name || "Customer Umum"}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                      {new Date(trx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-slate-900 font-black text-base tabular-nums">
                        {formatCurrency(trx.total_price)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => triggerPrint(trx)}
                          disabled={isPrinting}
                          className="bg-blue-600 text-white hover:bg-slate-900 px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50"
                        >
                          {isPrinting && selectedTrx?.id === trx.id ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                          <span className="text-[10px] font-black uppercase tracking-wider">Cetak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}