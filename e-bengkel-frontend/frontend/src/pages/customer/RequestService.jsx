import React, { useState, useEffect } from "react";
import { getMyVehicles } from "@/api/vehicle.api";
import { requestService } from "@/api/service.api";
import { ClipboardList, Send } from "lucide-react";

export default function RequestService() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ id_vehicle: "", complaint: "" });

  useEffect(() => {
    getMyVehicles().then(res => setVehicles(res.data || res));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestService(formData);
      alert("Booking Berhasil! Silakan datang ke bengkel.");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ClipboardList className="text-blue-600" /> Booking Servis
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Pilih Kendaraan</label>
          <select 
            className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, id_vehicle: e.target.value})}
            required
          >
            <option value="">-- Pilih Motor Anda --</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.plate_number})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Keluhan / Catatan</label>
          <textarea 
            className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Contoh: Ganti oli, rem bunyi srek-srek..."
            onChange={(e) => setFormData({...formData, complaint: e.target.value})}
            required
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
          <Send size={18} /> Kirim Request
        </button>
      </form>
    </div>
  );
}