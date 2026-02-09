import React, { useState, useEffect } from "react";
import { getMyVehicles } from "@/api/vehicle.api";
import { Bike, Plus, Trash2, Loader2, shieldCheck, AlertCircle } from "lucide-react";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await getMyVehicles();
      // Pastikan menyesuaikan dengan struktur response API kamu (data.data atau data)
      const data = res.data?.data || res.data || [];
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil daftar kendaraan:", err);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const fetchVehicles = async () => {
    console.log("Memulai fetch data..."); // Debug 1
    try {
      const res = await getMyVehicles();
      console.log("Data dari API:", res); // Debug 2 - Cek ini di console!
      
      const data = res.data?.data || res.data || [];
      setVehicles(data);
    } catch (err) {
      console.error("Error Fetching:", err.response || err); // Debug 3
      alert("Gagal konek ke server: " + err.message);
    } finally {
      console.log("Fetch selesai."); // Debug 4
      setLoading(false); // <--- Pastikan ini terpanggil!
    }
  };
  fetchVehicles();
}, []);

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">My_Garage</h1>
          <p className="text-gray-500 font-medium">Daftar kendaraan yang terdaftar untuk servis rutin.</p>
        </div>
        <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs hover:bg-gray-900 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest">
          <Plus size={18} /> Tambah Unit Baru
        </button>
      </div>

      {/* GRID KENDARAAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-full bg-white p-20 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Bike className="text-gray-200" size={40} />
            </div>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Garasi Kosong</p>
            <p className="text-gray-300 text-sm mt-1">Daftarkan motor Anda untuk mempermudah proses booking.</p>
          </div>
        ) : (
          vehicles.map((v) => (
            <div 
              key={v.id} 
              className="group bg-white p-8 rounded-[32px] border border-gray-50 flex justify-between items-center shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 relative overflow-hidden"
            >
              {/* Dekorasi Background */}
              <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                <Bike size={120} />
              </div>

              <div className="flex items-center gap-6 relative z-10">
                <div className="bg-blue-50 p-5 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Bike size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-xl text-gray-800 uppercase tracking-tighter">{v.merk || v.name}</h3>
                    <span className="bg-gray-100 text-[9px] font-black px-2 py-0.5 rounded text-gray-400 uppercase">{v.type || 'Unit'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-blue-600 font-mono font-black bg-blue-50 px-3 py-1 rounded-lg tracking-wider">
                        {v.plat_number || v.plate_number}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 relative z-10">
                <button className="text-gray-300 hover:text-red-500 p-3 bg-gray-50 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INFO FOOTER */}
      <div className="bg-gray-900 p-8 rounded-[32px] text-white flex items-center gap-6">
        <div className="bg-white/10 p-4 rounded-2xl">
          <AlertCircle className="text-blue-400" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Penting!</h4>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Pastikan Plat Nomor sesuai dengan STNK untuk menghindari kesalahan administrasi saat klaim garansi servis.
          </p>
        </div>
      </div>
    </div>
  );
}