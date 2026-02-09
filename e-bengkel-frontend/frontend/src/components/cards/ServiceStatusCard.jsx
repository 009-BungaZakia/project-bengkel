import React from "react";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";

export default function ServiceStatusCard({ service, onDetailClick }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800">{service.plate_number}</h3>
          <p className="text-sm text-gray-500">{service.brand} {service.model}</p>
        </div>
        <Badge status={service.status} />
      </div>
      
      <div className="border-t border-gray-100 pt-3 mb-4">
        <p className="text-xs text-gray-400 uppercase font-semibold">Keluhan:</p>
        <p className="text-sm text-gray-700 line-clamp-2">{service.complaint}</p>
      </div>

      <Button 
        variant="outline" 
        className="w-full text-sm py-1.5" 
        onClick={() => onDetailClick(service.id_service)}
      >
        Lihat Detail Progres
      </Button>
    </div>
  );
}