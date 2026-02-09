import React from "react";
import Button from "@/components/common/Button";

export default function ServiceRequestForm({ vehicles, onSubmit, isLoading }) {
  const [selectedVehicle, setSelectedVehicle] = React.useState("");
  const [complaint, setComplaint] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id_vehicle: selectedVehicle, complaint });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Pilih Kendaraan</label>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          required
        >
          <option value="">-- Pilih Kendaraan Anda --</option>
          {vehicles.map((v) => (
            <option key={v.id_vehicle} value={v.id_vehicle}>
              {v.plate_number} - {v.brand} {v.model}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Keluhan / Catatan</label>
        <textarea 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          rows="4"
          placeholder="Jelaskan masalah kendaraan Anda..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          required
        ></textarea>
      </div>

      <Button type="submit" variant="primary" disabled={isLoading || !selectedVehicle}>
        {isLoading ? "Mengirim..." : "Kirim Request Servis"}
      </Button>
    </form>
  );
}