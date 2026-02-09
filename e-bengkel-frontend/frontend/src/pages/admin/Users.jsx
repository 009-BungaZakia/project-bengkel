import React, { useState, useEffect } from "react";
import { UserPlus, Search, Edit, Trash2, Loader2, Users as UsersIcon, X } from "lucide-react";
// Tambahkan deleteCustomer dan updateCustomer di import
import { getAllCustomers, createCustomer, deleteCustomer, updateCustomer } from "@/api/customer.api"; 

export default function Users() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // NULL = Tambah, ADA ID = Edit
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getAllCustomers();
      const actualData = res?.data?.data || res?.data || res; 
      setCustomers(Array.isArray(actualData) ? actualData : []);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // FUNGSI HAPUS
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      try {
        await deleteCustomer(id);
        alert("Pelanggan berhasil dihapus!");
        fetchCustomers(); // Refresh data
      } catch (err) {
        alert("Gagal menghapus pelanggan. Cek koneksi backend!");
      }
    }
  };

  // FUNGSI BUKA MODAL EDIT
  const handleEditClick = (customer) => {
    setEditingId(customer.id); // Set ID yang sedang diedit
    setFormData({ 
      name: customer.name, 
      phone: customer.phone || "", 
      address: customer.address || "" 
    });
    setIsModalOpen(true);
  };

  // FUNGSI SIMPAN (TAMBAH & EDIT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        // PROSES UPDATE
        await updateCustomer(editingId, formData);
        alert("Data pelanggan berhasil diperbarui!");
      } else {
        // PROSES TAMBAH BARU
        await createCustomer(formData);
        alert("Pelanggan berhasil ditambahkan!");
      }
      
      handleCloseModal();
      fetchCustomers(); 
    } catch (err) {
      const msg = err.response?.data?.error || "Terjadi kesalahan pada server.";
      alert("Gagal: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", phone: "", address: "" });
  };

  const filtered = Array.isArray(customers) ? customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-500 animate-pulse">Mengambil data pelanggan...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <UsersIcon size={28} className="text-blue-600"/> Kelola Pelanggan
        </h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
          >
            <UserPlus size={18} /> <span className="hidden md:block">Tambah</span>
          </button>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Nama Pelanggan</th>
              <th className="px-6 py-4">Telepon</th>
              <th className="px-6 py-4">Alamat</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length > 0 ? filtered.map((c, index) => (
              <tr key={c.id || index} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{c.name}</td>
                <td className="px-6 py-4 text-slate-600">{c.phone || "-"}</td>
                <td className="px-6 py-4 text-slate-600 italic text-sm">{c.address || "Tidak ada alamat"}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {/* TOMBOL EDIT */}
                    <button 
                      onClick={() => handleEditClick(c)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit size={18}/>
                    </button>
                    {/* TOMBOL HAPUS */}
                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-400">Data pelanggan tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL POP-UP (TAMBAH & EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Pelanggan" : "Tambah Pelanggan"}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text"
                  required
                  disabled={isSubmitting}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-50"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                <input 
                  type="text"
                  disabled={isSubmitting}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-50"
                  placeholder="0812xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat</label>
                <textarea 
                  disabled={isSubmitting}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 disabled:bg-slate-50"
                  placeholder="Jl. Merdeka No. 123..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Menyimpan...
                    </>
                  ) : editingId ? "Update Data" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}