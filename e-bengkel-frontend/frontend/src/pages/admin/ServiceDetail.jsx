import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosConfig";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ item_name: "", quantity: 1, price: "" });

  const fetchDetail = async () => {
    try {
      const res = await axiosInstance.get(`/services/${id}`);
      setService(res.data.data);
    } catch (err) {
      alert("Gagal ambil detail servis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/services/${id}/items`, newItem);
      setNewItem({ item_name: "", quantity: 1, price: "" });
      fetchDetail(); // Refresh list
    } catch (err) {
      alert("Gagal menambah item");
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black">
        <ArrowLeft size={20} /> Kembali ke Antrean
      </button>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold">Detail Servis #{id}</h1>
        <p className="text-gray-500">Pelanggan: <span className="font-semibold text-gray-800">{service?.nama_customer}</span></p>
        <p className="text-gray-500 font-italic">" {service?.description} "</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form Tambah Item */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Tambah Item</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <input 
              type="text" placeholder="Nama Sparepart / Jasa" required
              className="w-full p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={newItem.item_name}
              onChange={(e) => setNewItem({...newItem, item_name: e.target.value})}
            />
            <input 
              type="number" placeholder="Qty" required
              className="w-full p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
            />
            <input 
              type="number" placeholder="Harga Satuan" required
              className="w-full p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            />
            <button className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
              Tambahkan
            </button>
          </form>
        </div>

        {/* Tabel Item yang Sudah Ditambahkan */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4">Daftar Sparepart & Jasa</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b">
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium text-center">Qty</th>
                  <th className="pb-3 font-medium text-right">Harga</th>
                  <th className="pb-3 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {service?.items?.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-4 font-medium text-gray-800">{item.item_name}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">Rp {item.price.toLocaleString()}</td>
                    <td className="py-4 text-right font-bold">Rp {(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}
                {service?.items?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-gray-400">Belum ada item ditambahkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}