import React, { useReducer, useEffect } from "react";
import { X, Calendar } from "lucide-react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return { 
        id_customer: "", 
        service_date: new Date().toISOString().split('T')[0], 
        problem: "" 
      };
    case "SET_FORM":
      return { 
        id_customer: action.payload.id_customer || "", 
        service_date: action.payload.service_date || new Date().toISOString().split('T')[0], 
        problem: action.payload.description || action.payload.problem || "" 
      };
    default:
      return state;
  }
};

export default function ServiceForm({ isOpen, onClose, customers, onSubmit, isEdit, editData }) {
  const [formState, dispatch] = useReducer(formReducer, {
    id_customer: "",
    service_date: new Date().toISOString().split('T')[0],
    problem: "",
  });

  useEffect(() => {
    if (isEdit && editData) {
      dispatch({ type: "SET_FORM", payload: editData });
    } else {
      dispatch({ type: "RESET" });
    }
  }, [isEdit, editData, isOpen]);

  if (!isOpen) return null;

  const handleValidateAndSubmit = (e) => {
    e.preventDefault();
    if (!formState.id_customer) return alert("Pilih pelanggan!");
    if (!formState.service_date) return alert("Pilih tanggal!");
    if (formState.problem.trim().length < 5) return alert("Keluhan minimal 5 karakter!");

    onSubmit(formState); 
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-8 space-y-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
            {isEdit ? "Update Antrean" : "Input Antrean Baru"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleValidateAndSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Pelanggan</label>
            <select 
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              value={formState.id_customer}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "id_customer", value: e.target.value })}
            >
              <option value="">— Pilih Customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.nama || c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 flex items-center gap-1">
              <Calendar size={12} /> Tanggal Rencana Servis
            </label>
            <input 
              type="date"
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              value={formState.service_date}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "service_date", value: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Masalah</label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl h-28 outline-none focus:ring-2 focus:ring-blue-600 font-medium" 
              placeholder="Detail masalah..."
              value={formState.problem} 
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "problem", value: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className={`w-full text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all active:scale-95 ${
              isEdit ? 'bg-amber-600 shadow-amber-200' : 'bg-blue-600 shadow-blue-200'
            }`}
          >
            {isEdit ? "Simpan Perubahan" : "Daftarkan Antrean"}
          </button>
        </form>
      </div>
    </div>
  );
}