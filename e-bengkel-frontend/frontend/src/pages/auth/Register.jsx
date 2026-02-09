import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "@/api/auth.api";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err) {
      setError(err || "Gagal mendaftar, email mungkin sudah digunakan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Daftar Akun</h2>
          <p className="text-gray-500 text-sm">Bergabunglah untuk servis lebih mudah</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <Input label="Nama Lengkap" name="name" placeholder="Budi Santoso" value={formData.name} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" placeholder="budi@example.com" value={formData.email} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          <Input label="No. Telepon" name="phone" placeholder="0812xxxx" value={formData.phone} onChange={handleChange} />
          <div className="flex flex-col gap-1">
             <label className="text-sm font-semibold text-gray-700">Alamat</label>
             <textarea 
               name="address"
               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               value={formData.address}
               onChange={handleChange}
               rows="2"
             ></textarea>
          </div>
          
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Mendaftarkan..." : "Daftar Akun"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}