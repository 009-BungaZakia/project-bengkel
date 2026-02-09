import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosConfig"; 
import { getAdminStats } from "@/api/admin.api"; 
import { Users, AlertCircle, Wrench, ClipboardList, Plus, Pencil, Trash2, X, Printer, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentServices, setRecentServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pelanggan'); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dataEndpoint = activeTab === 'pelanggan' ? "/vehicles" : "/services/items";
      
      const [resStats, resTableData, resCustomers, resAllServices] = await Promise.all([
        getAdminStats().catch(() => ({ data: null })),
        axiosInstance.get(dataEndpoint).catch(() => ({ data: [] })),
        axiosInstance.get("/customers").catch(() => ({ data: [] })),
        axiosInstance.get("/services").catch(() => ({ data: [] }))
      ]);

      setStats(resStats.data || resStats);
      
      // Ambil data dari response. Handle jika response berbentuk { data: [...] }
      const tableData = resTableData.data?.data || resTableData.data || [];
      setRecentServices(Array.isArray(tableData) ? tableData : []);
      
      const custData = resCustomers.data?.data || resCustomers.data || [];
      setCustomers(Array.isArray(custData) ? custData : []);

      const srvData = resAllServices.data?.data || resAllServices.data || [];
      setAllServices(Array.isArray(srvData) ? srvData : []);

    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === 'pelanggan' ? '/vehicles' : '/services/items'; 
      
      // TANGGUNG JAWAB: Mapping data untuk Kendaraan (Pelanggan) dan Barang
      const payload = activeTab === 'pelanggan' ? {
        id_customer: Number(formData.id_customer),
        merk: formData.merk,
        nomor_plat: formData.nomor_plat?.toUpperCase(),
        tipe: formData.tipe,
        tahun: Number(formData.tahun)
      } : {
        service_id: Number(formData.service_id),
        item_name: formData.item_name,
        quantity: Number(formData.quantity),
        price: Number(formData.price)
      };

      if (isEdit) {
        const id = activeTab === 'pelanggan' ? (formData.id_vehicle || formData.id) : formData.id;
        await axiosInstance.put(`${endpoint}/${id}`, payload);
      } else {
        await axiosInstance.post(endpoint, payload);
      }
      
      alert(`Data ${activeTab === 'pelanggan' ? 'Kendaraan' : 'Barang'} Berhasil Disimpan!`);
      handleCloseModal();
      loadDashboardData(); 
    } catch (err) {
      console.error("Error Detail:", err.response?.data);
      alert("Gagal: " + (err.response?.data?.message || "Terjadi kesalahan pada database"));
    }
  };

  const handleOpenModal = (data = null) => {
    if (data) {
      setIsEdit(true);
      setFormData(data);
    } else {
      setIsEdit(false);
      setFormData(activeTab === 'pelanggan' 
        ? { merk: '', nomor_plat: '', tipe: '', tahun: '', id_customer: '' } 
        : { item_name: '', quantity: 1, price: 0, service_id: '' }
      ); 
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleDelete = async (srv) => {
    const id = activeTab === 'pelanggan' ? (srv.id_vehicle || srv.id) : srv.id;
    if (window.confirm("Hapus data ini?")) {
      try {
        const endpoint = activeTab === 'pelanggan' ? '/vehicles' : '/services/items';
        await axiosInstance.delete(`${endpoint}/${id}`);
        loadDashboardData();
      } catch (err) {
        alert("Gagal menghapus");
      }
    }
  };

  const handlePrintInvoice = async (serviceId) => {
    // ... (fungsi print tetap sama)
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
        <div className="bg-blue-600 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
          <Users />
          <div><p className="text-xs font-bold opacity-70 uppercase">Customer</p><p className="text-2xl font-black">{stats?.total_customers || 0}</p></div>
        </div>
        <div className="bg-orange-500 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
          <AlertCircle />
          <div><p className="text-xs font-bold opacity-70 uppercase">Antrean</p><p className="text-2xl font-black">{stats?.pending_services || 0}</p></div>
        </div>
        <div className="bg-emerald-500 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
          <Wrench />
          <div><p className="text-xs font-bold opacity-70 uppercase">Proses</p><p className="text-2xl font-black">{stats?.active_services || 0}</p></div>
        </div>
        <div className="bg-purple-600 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
          <ClipboardList />
          <div><p className="text-xs font-bold opacity-70 uppercase">Selesai</p><p className="text-2xl font-black">{stats?.completed_services || 0}</p></div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
            <button onClick={() => setActiveTab('pelanggan')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pelanggan' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'}`}>KENDARAAN</button>
            <button onClick={() => setActiveTab('barang')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'barang' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'}`}>BARANG / PART</button>
          </div>
          <button onClick={() => handleOpenModal()} className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg hover:bg-blue-700 transition-all">
            <Plus size={18} className="mr-2" /> TAMBAH {activeTab === 'pelanggan' ? 'KENDARAAN' : 'BARANG'}
          </button>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-6 border-b">
                <th className="py-3 px-6">{activeTab === 'pelanggan' ? 'Merk/Tipe' : 'Nama Barang'}</th>
                <th className="py-3 px-6">{activeTab === 'pelanggan' ? 'No. Plat' : 'Qty'}</th>
                <th className="py-3 px-6">{activeTab === 'pelanggan' ? 'Tahun' : 'Subtotal'}</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentServices.length > 0 ? (
                recentServices.map((srv, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800">{activeTab === 'pelanggan' ? srv.merk : srv.item_name}</p>
                      <p className="text-xs text-gray-400">{activeTab === 'pelanggan' ? srv.tipe : `Service ID: #${srv.service_id}`}</p>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      {activeTab === 'pelanggan' ? srv.nomor_plat : srv.quantity}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-600">
                      {activeTab === 'pelanggan' ? srv.tahun : `Rp ${(srv.quantity * srv.price).toLocaleString()}`}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        {activeTab === 'barang' && (
                          <button onClick={() => handlePrintInvoice(srv.service_id)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg" title="Cetak Nota"><Printer size={16}/></button>
                        )}
                        <button onClick={() => handleOpenModal(srv)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Pencil size={14}/></button>
                        <button onClick={() => handleDelete(srv)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-10 text-gray-400">Belum ada data {activeTab}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (FORM) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-tighter text-gray-800">
                {isEdit ? 'Ubah' : 'Tambah'} {activeTab === 'pelanggan' ? 'Kendaraan' : 'Barang'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'pelanggan' ? (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Pemilik</label>
                    <select required value={formData.id_customer || ''} onChange={(e) => setFormData({...formData, id_customer: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Pilih Customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <input required placeholder="Merk (Contoh: Honda)" value={formData.merk || ''} onChange={(e) => setFormData({...formData, merk: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                  <div className="grid grid-cols-2 gap-2">
                    <input required placeholder="No Plat" value={formData.nomor_plat || ''} onChange={(e) => setFormData({...formData, nomor_plat: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none uppercase" />
                    <input required placeholder="Tipe" value={formData.tipe || ''} onChange={(e) => setFormData({...formData, tipe: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                  </div>
                  <input required type="number" placeholder="Tahun" value={formData.tahun || ''} onChange={(e) => setFormData({...formData, tahun: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                </>
              ) : (
                <>
                  {/* ... (Form Barang tetap sama) ... */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Nama Barang</label>
                    <input required placeholder="Masukkan Nama Barang" value={formData.item_name || ''} onChange={(e) => setFormData({...formData, item_name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input required type="number" placeholder="Qty" value={formData.quantity || ''} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                    <input required type="number" placeholder="Harga" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none" />
                  </div>
                  <select required value={formData.service_id || ''} onChange={(e) => setFormData({...formData, service_id: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none">
                    <option value="">Pilih Antrean Servis</option>
                    {allServices.map(s => <option key={s.id} value={s.id}>#{s.id} - {s.customer_name}</option>)}
                  </select>
                </>
              )}
              <div className="flex space-x-2 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-4 font-bold text-gray-400">BATAL</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}