import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosConfig"; 
import * as ServiceAPI from "@/api/service.api";
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Loader2 
} from "lucide-react";

export default function JobAssignment() {
  const [activeServices, setActiveServices] = useState([]); 
  const [serviceItems, setServiceItems] = useState([]); 
  const [allServices, setAllServices] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tugas'); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const loadJobData = async () => {
    try {
      setLoading(true);
      // Menggunakan allSettled agar jika API Barang gagal/kosong, Daftar Tugas tetap muncul
      const [resActive, resItems] = await Promise.allSettled([
        ServiceAPI.getAllServices(),
        axiosInstance.get("/services/items")
      ]);

      // Handle Data Antrean
      if (resActive.status === 'fulfilled') {
        const data = resActive.value?.data || resActive.value || [];
        setActiveServices(data.filter(s => s.status !== 'selesai'));
        setAllServices(data);
      }

      // Handle Data Barang
      if (resItems.status === 'fulfilled') {
        const items = resItems.value?.data?.data || resItems.value?.data || [];
        setServiceItems(items);
      } else {
        setServiceItems([]); // Reset jika gagal
      }

    } catch (err) {
      console.error("Gagal memuat data pekerjaan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobData(); }, []);

  const handleSubmitBarang = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        service_id: Number(formData.service_id),
        item_name: formData.item_name,
        quantity: Number(formData.quantity),
        price: Number(formData.price)
      };

      if (isEdit) {
        await axiosInstance.put(`/services/items/${formData.id}`, payload);
      } else {
        await axiosInstance.post('/services/items', payload);
      }
      
      alert("Data Barang Berhasil Disimpan!");
      handleCloseModal();
      loadJobData(); 
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || "Error Database"));
    }
  };

  const handleUpdateStatus = async (serviceId) => {
    if (!window.confirm("Selesaikan pengerjaan ini?")) return;
    try {
      await ServiceAPI.completeService(serviceId);
      loadJobData();
      alert("Status diperbarui menjadi Selesai!");
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const handleOpenModal = (data = null) => {
    setIsEdit(!!data);
    setFormData(data || { item_name: '', quantity: 1, price: 0, service_id: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Memuat Tugas...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto min-h-screen">
      {/* Header & Tab Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-800">Job Assignment</h1>
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-gray-100 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('tugas')} 
            className={`flex-1 md:flex-none px-8 py-2.5 rounded-[1.2rem] text-[10px] font-black transition-all ${activeTab === 'tugas' ? 'bg-slate-900 text-white shadow-lg' : 'text-gray-400'}`}
          >
            TUGAS AKTIF
          </button>
          <button 
            onClick={() => setActiveTab('barang')} 
            className={`flex-1 md:flex-none px-8 py-2.5 rounded-[1.2rem] text-[10px] font-black transition-all ${activeTab === 'barang' ? 'bg-slate-900 text-white shadow-lg' : 'text-gray-400'}`}
          >
            INPUT PART
          </button>
        </div>
      </div>

      {activeTab === 'tugas' ? (
        <div className="grid gap-4">
          {activeServices.length > 0 ? activeServices.map((srv) => (
            <div key={srv.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-200 transition-all group">
              <div className="flex items-center gap-5 w-full">
                <div className="p-4 rounded-2xl bg-blue-50 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="font-black italic uppercase text-slate-800">#{srv.id} - {srv.Customer?.nama || srv.customer_name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    {srv.Vehicle?.plat_nomor || 'TANPA PLAT'} • {srv.Vehicle?.merk || 'UNIT'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-md font-black uppercase italic leading-none">{srv.status}</span>
                    <p className="text-xs text-slate-500 font-medium italic">"{srv.description}"</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleUpdateStatus(srv.id)} 
                className="w-full md:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-all active:scale-95"
              >
                Selesaikan
              </button>
            </div>
          )) : (
            <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
              <CheckCircle size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase text-xs">Belum ada tugas pengerjaan</p>
            </div>
          )}
        </div>
      ) : (
        /* TAB BARANG */
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-black uppercase text-[10px] tracking-widest text-gray-400">Log Pemakaian Part & Oli</h2>
            <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-100 hover:scale-105 transition-transform">
              <Plus size={20} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-gray-400 border-b">
                  <th className="p-6">Barang</th>
                  <th className="p-6">Antrean</th>
                  <th className="p-6">Qty</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {serviceItems.length > 0 ? serviceItems.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="p-6">
                       <p className="font-bold text-slate-700">{item.item_name}</p>
                       <p className="text-[10px] text-gray-400 font-bold">Rp {Number(item.price).toLocaleString()}</p>
                    </td>
                    <td className="p-6 font-black text-blue-600 italic">#{item.service_id}</td>
                    <td className="p-6 font-bold text-slate-600">{item.quantity}</td>
                    <td className="p-6 text-center">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={16}/></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-300 font-bold italic uppercase text-xs">Belum ada pemakaian barang</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL INPUT BARANG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Input Part / Oli</h3>
              <button onClick={handleCloseModal} className="text-gray-300 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmitBarang} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2">ID Antrean Servis</label>
                <select required value={formData.service_id} onChange={(e) => setFormData({...formData, service_id: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-slate-700">
                  <option value="">-- Pilih Antrean --</option>
                  {allServices.map(s => <option key={s.id} value={s.id}>#{s.id} - {s.customer_name || s.Customer?.nama}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Nama Barang</label>
                <input required placeholder="Contoh: Oli Mesran 1L" value={formData.item_name} onChange={(e) => setFormData({...formData, item_name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Qty</label>
                  <input required type="number" placeholder="0" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Harga Satuan</label>
                  <input required type="number" placeholder="Rp" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 font-black text-[10px] text-gray-400 uppercase tracking-widest">Batal</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all active:scale-95">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}