import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import * as ServiceAPI from "@/api/service.api";
import * as CustomerAPI from "@/api/customer.api"; 
import { Plus, Loader2, AlertCircle } from "lucide-react";

import ServiceForm from "./ServiceForm";
import ServiceList from "./ServiceList";
import { ServiceContext } from "../../App"; 

export default function ManageServices() {
  const { setQueueCount } = useContext(ServiceContext);

  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editData, setEditData] = useState(null);

  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // --- UTILS ---
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  const calculateTotal = (srv) => {
    if (!srv) return 0;
    const itemTotal = (srv.fetchedItems || []).reduce((acc, item) => 
      acc + (Number(item.price) * Number(item.quantity)), 0);
    const serviceFee = Number(srv.total_price || 0);
    return itemTotal + serviceFee;
  };

  const stats = useMemo(() => ({
    total: services.length,
    pending: services.filter(s => s.status !== 'selesai' && s.status !== 'Selesai').length
  }), [services]);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [srvRes, custRes, vehRes] = await Promise.all([
        ServiceAPI.getAllServices(),
        CustomerAPI.getAllCustomers(),
        axios.get("http://localhost:3000/api/vehicles", { headers })
      ]);

      const dataServices = srvRes?.data?.data || srvRes?.data || srvRes || [];
      setServices(dataServices);
      setCustomers(custRes?.data?.data || custRes?.data || custRes || []);
      setVehicles(vehRes?.data?.data || vehRes?.data || vehRes || []);
      setQueueCount(dataServices.length);
    } catch (err) {
      setError("Gagal sinkronisasi data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEditTrigger = (srv) => {
    setIsEdit(true);
    setSelectedId(srv.id);
    setEditData(srv); 
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const autoVeh = vehicles.find(v => Number(v.id_customer) === Number(formData.id_customer));
      
      const payload = {
        id_customer: Number(formData.id_customer),
        id_vehicle: autoVeh?.id_vehicle || autoVeh?.id || 1, 
        service_date: formData.service_date,
        description: formData.problem
      };

      if (isEdit) {
        await axios.put(`http://localhost:3000/api/services/${selectedId}`, payload, { headers });
        alert("Berhasil diperbarui!");
      } else {
        await ServiceAPI.createService(payload);
        alert("Antrean didaftarkan!");
      }

      setIsModalOpen(false);
      setEditData(null);
      fetchData();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Gagal simpan"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Hapus #${id}?`)) return;
    try {
      await ServiceAPI.deleteService(id);
      fetchData();
    } catch (err) {
      alert("Gagal hapus.");
    }
  };

  const handlePrint = async (srv) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const itemsRes = await axios.get("http://localhost:3000/api/services/items", { headers });
      const allItems = itemsRes.data?.data || itemsRes.data || [];
      
      const relatedItems = allItems.filter(item => 
        Number(item.id_service || item.service_id) === Number(srv.id)
      );

      setSelectedService({ ...srv, fetchedItems: relatedItems });
      setShowInvoice(true);
    } catch (err) {
      alert("Gagal memuat rincian biaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto min-h-screen bg-gray-50/50">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Antrean Bengkel</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
            Total: {stats.total} | Pending: {stats.pending}
          </p>
        </div>
        <button 
          onClick={() => { setIsEdit(false); setEditData(null); setIsModalOpen(true); }} 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase shadow-lg active:scale-95 transition-all"
        >
          <Plus size={18} /> Terima Servis Baru
        </button>
      </div>

      {loading && !isModalOpen && !showInvoice ? (
        <div className="p-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <ServiceList services={services} onDelete={handleDelete} onPrint={handlePrint} onEdit={handleEditTrigger} />
      )}

      <ServiceForm 
        isOpen={isModalOpen} isEdit={isEdit} editData={editData} 
        onClose={() => setIsModalOpen(false)} customers={customers} 
        vehicles={vehicles} onSubmit={handleFormSubmit} 
      />

      {/* MODAL STRUK */}
      {showInvoice && selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 no-print-overlay">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xs shadow-2xl animate-in zoom-in-95">
            
            {/* AREA CETAK */}
            <div id="print-area" className="bg-[#fffef0] p-5 border border-dashed border-gray-400 font-mono text-[10px] text-black">
              <center className="mb-4 uppercase leading-tight font-bold border-b border-black pb-2">
                E-BENGKEL JAYA<br/><small className="font-normal text-[8px]">Struk Servis Resmi</small>
              </center>
              
              <div className="space-y-1 uppercase text-[9px]">
                <div className="flex justify-between">
                  <span>NO. STRUK:</span> 
                  <span>#{selectedService.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span>TANGGAL:</span> 
                  <span>{new Date(selectedService.service_date || new Date()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>WAKTU:</span> 
                  <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>PELANGGAN:</span> 
                  <span>{selectedService.Customer?.nama || selectedService.customer_name || "Umum"}</span>
                </div>
              </div>
              
              <p className="my-2 border-b border-dashed border-gray-400"></p>
              
              <div className="space-y-2">
                {(selectedService.fetchedItems || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between uppercase text-[9px]">
                    <span>{item.item_name} (x{item.quantity})</span>
                    <span>{formatRupiah(item.price * item.quantity).replace('Rp', '')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 border-t-2 pt-2 font-bold uppercase italic border-black text-[11px]">
                <span>TOTAL AKHIR:</span>
                <span>{formatRupiah(calculateTotal(selectedService))}</span>
              </div>

              <center className="mt-6 text-[7px] text-gray-400 uppercase tracking-widest italic">
                *** Terima Kasih ***<br/>Sudah Mempercayai Layanan Kami
              </center>
            </div>

            <div className="mt-6 space-y-2 no-print">
              <button 
                onClick={() => window.print()} 
                className="w-full bg-black text-white py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all"
              >
                Cetak Struk
              </button>
              <button 
                onClick={() => setShowInvoice(false)} 
                className="w-full bg-gray-100 text-gray-400 py-3 rounded-2xl font-black text-[10px] uppercase"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS MEDIA PRINT FIX */}
      <style>{`
        @media print {
          /* 1. Sembunyikan elemen dashboard agar tidak mengganggu */
          body * {
            visibility: hidden;
          }

          /* 2. Hanya area struk yang terlihat */
          #print-area, #print-area * {
            visibility: visible;
          }

          /* 3. Posisi struk dipaksa ke pojok kiri atas kertas */
          #print-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background-color: white !important;
            border: none !important;
          }

          /* 4. Sembunyikan tombol dan background modal */
          .no-print-overlay {
            background: none !important;
            backdrop-filter: none !important;
          }
          .no-print {
            display: none !important;
          }
          
          @page {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}