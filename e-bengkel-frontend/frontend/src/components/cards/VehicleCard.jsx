import React from "react";
import { Trash2, Edit } from "lucide-react"; // Opsional: pakai lucide-react untuk icon

export default function VehicleCard({ vehicle, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 text-white p-3 rounded-lg font-bold">
          {vehicle.plate_number.split(' ')[0]}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h4>
          <p className="text-sm text-gray-500">{vehicle.plate_number} • Tahun {vehicle.year || '-'}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button onClick={() => onEdit(vehicle)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(vehicle.id_vehicle)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}