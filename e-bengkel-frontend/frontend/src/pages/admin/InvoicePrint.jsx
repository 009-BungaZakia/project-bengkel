import React, { forwardRef } from "react";

const InvoicePrint = forwardRef(({ transaction, mode = "a4" }, ref) => {
  if (!transaction) return null;

  const totalSpareparts = transaction.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const jasaServis = 50000;
  const grandTotal = totalSpareparts + jasaServis;

  const formatRupiah = (num) => `Rp ${num.toLocaleString('id-ID')}`;

  // --- TAMPILAN 1: MODE STRUK KASIR (BARU) ---
  if (mode === "struk") {
    return (
      <div ref={ref} className="bg-[#fffef0] p-4 font-mono text-xs border border-dashed border-black" style={{ width: '80mm' }}>
        <center className="mb-4">
          <strong className="text-sm">SMK BENGKEL PROJECT</strong><br />
          <small>Bukti Pembayaran Lunas</small>
          <p className="my-1">==========================</p>
        </center>
        
        <div className="space-y-1 mb-4">
          <p>ID: #{transaction.id}</p>
          <p>Cust: {transaction.Customer?.name || "Pelanggan"}</p>
          <p>Tgl: {new Date(transaction.updated_at).toLocaleDateString()}</p>
        </div>
        
        <p className="my-1">==========================</p>
        
        {transaction.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{item.item_name} (x{item.quantity})</span>
            <span>{formatRupiah(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between italic">
          <span>Jasa Servis</span>
          <span>{formatRupiah(jasaServis)}</span>
        </div>

        <p className="my-1">==========================</p>
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL</span>
          <span>{formatRupiah(grandTotal)}</span>
        </div>

        <center className="mt-6">
          <small>Terima kasih sudah servis!</small>
        </center>
      </div>
    );
  }

  // --- TAMPILAN 2: MODE A4 (INVOICE LENGKAP) ---
  return (
    <div ref={ref} className="p-10 bg-white text-slate-900 font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-blue-600">BENGKEL JAYA</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Jl. Raya Otomotif No. 123, Indonesia</p>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tel: (021) 123-4567 | Email: info@bengkeljaya.com</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black uppercase text-slate-900">INVOICE</h2>
          <p className="text-sm font-bold text-gray-400 uppercase">No. Invoice: #{transaction.id}</p>
          <p className="text-sm font-bold text-gray-400 uppercase">Tanggal: {new Date(transaction.updated_at || transaction.created_at).toLocaleDateString('id-ID')}</p>
        </div>
      </div>

      {/* CUSTOMER INFO */}
      <div className="mb-8">
        <h3 className="text-lg font-black uppercase text-slate-900 mb-4">Informasi Pelanggan</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">Nama Pelanggan</p>
            <p className="font-bold text-slate-900">{transaction.Customer?.name || transaction.customer_name || "Pelanggan"}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">Kendaraan</p>
            <p className="font-bold text-slate-900">{transaction.Vehicle?.plat_nomor || "Tidak ada data"} - {transaction.Vehicle?.merk || ""} {transaction.Vehicle?.model || ""}</p>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="mb-8">
        <h3 className="text-lg font-black uppercase text-slate-900 mb-4">Detail Pekerjaan & Sparepart</h3>
        <table className="w-full border-collapse border border-slate-300">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-4 py-2 text-left font-bold uppercase text-sm">Deskripsi</th>
              <th className="border border-slate-300 px-4 py-2 text-center font-bold uppercase text-sm">Qty</th>
              <th className="border border-slate-300 px-4 py-2 text-right font-bold uppercase text-sm">Harga</th>
              <th className="border border-slate-300 px-4 py-2 text-right font-bold uppercase text-sm">Total</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-slate-300 px-4 py-2">{item.item_name}</td>
                <td className="border border-slate-300 px-4 py-2 text-center">{item.quantity}</td>
                <td className="border border-slate-300 px-4 py-2 text-right">{formatRupiah(item.price)}</td>
                <td className="border border-slate-300 px-4 py-2 text-right">{formatRupiah(item.price * item.quantity)}</td>
              </tr>
            ))}
            <tr>
              <td className="border border-slate-300 px-4 py-2 font-bold" colSpan="3">Jasa Servis</td>
              <td className="border border-slate-300 px-4 py-2 text-right font-bold">{formatRupiah(jasaServis)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="flex justify-end mb-8">
        <div className="w-1/3">
          <div className="flex justify-between border-t-2 border-slate-900 pt-2">
            <span className="font-bold uppercase text-lg">Total:</span>
            <span className="font-black text-xl">{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t-2 border-slate-900 pt-6 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase">Terima kasih telah mempercayakan kendaraan Anda kepada kami!</p>
        <p className="text-xs text-gray-400 mt-2">Pembayaran telah lunas. Invoice ini sah tanpa tanda tangan.</p>
      </div>
    </div>
  );
});

export default InvoicePrint;