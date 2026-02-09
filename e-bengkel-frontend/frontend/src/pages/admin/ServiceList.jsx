import React from "react";
import { Wrench, CheckCircle, Printer, Trash2, Pencil } from "lucide-react";

export default function ServiceList({ services, onPrint, onDelete, onEdit }) {
  if (services.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Belum ada antrean servis</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {services.map((srv) => (
        <div key={srv.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:shadow-md">
          <div className="flex gap-5 items-center w-full">
            <div className={`p-5 rounded-[1.5rem] shrink-0 ${srv.status === 'selesai' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
              {srv.status === 'selesai' ? <CheckCircle size={30} /> : <Wrench size={30} />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-black text-lg text-gray-800 uppercase italic">#{srv.id}</h3>
                <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${srv.status === 'selesai' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {srv.status}
                </span>
              </div>
              <p className="font-bold text-gray-700 uppercase tracking-tight">
                {srv.Customer?.nama || srv.customer_name || "Pelanggan Umum"}
              </p>
              <p className="text-xs text-gray-400 italic font-medium">"{srv.description}"</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {/* Tombol Edit */}
            <button 
              onClick={() => onEdit(srv)}
              className="p-4 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition-all active:scale-90"
              title="Edit Antrean"
            >
              <Pencil size={20} />
            </button>
            
            {/* Tombol Print */}
            <button 
              onClick={() => onPrint(srv)}
              className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all active:scale-90"
            >
              <Printer size={20} />
            </button>

            {/* Tombol Hapus */}
            <button 
              onClick={() => onDelete(srv.id)}
              className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-90"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}