import React from "react";
import { User, Mail, ShieldCheck, LogOut, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MekanikProfile() {
  const navigate = useNavigate();
  // Ambil data user dari localStorage yang disimpan saat login
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-gray-800 mb-8">Profil Mekanik</h1>

      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
        {/* Header Profil (Warna Biru) */}
        <div className="h-32 bg-blue-600 flex items-center justify-center">
           <div className="w-24 h-24 bg-white rounded-full border-4 border-white translate-y-12 flex items-center justify-center shadow-lg">
              <Wrench size={40} className="text-blue-600" />
           </div>
        </div>

        {/* Info User */}
        <div className="pt-16 pb-8 px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{user.name || "Mekanik Bengkel"}</h2>
          <p className="text-gray-500 font-medium">Spesialis Mekanik Ahli</p>

          <div className="mt-8 space-y-4 text-left">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="bg-white p-2 rounded-xl shadow-sm"><Mail size={20} className="text-blue-500" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                <p className="text-sm font-bold text-gray-700">{user.email || "mekanik@bengkel.com"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="bg-white p-2 rounded-xl shadow-sm"><ShieldCheck size={20} className="text-green-500" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Role</p>
                <p className="text-sm font-bold text-gray-700 capitalize">{user.role || "mekanik"}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-10 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-black hover:bg-red-100 transition-all"
          >
            <LogOut size={20} />
            Keluar dari Sistem
          </button>
        </div>
      </div>
    </div>
  );
}