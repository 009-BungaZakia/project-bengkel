import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "@/api/auth.api"; 
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { LogIn } from "lucide-react";
import useAuthStore from "@/store/authStore"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const loginStore = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Panggil API login
     const res = await loginApi({ email: email.trim(), password: password.trim() });
      
      /** * PERBAIKAN DI SINI:
       * Di auth.api.js kamu mengembalikan 'response.data'.
       * Maka di sini, data user & token ada di 'res.data'
       */
      const user = res?.data?.user;
      const token = res?.data?.token;

      if (!user || !token) {
        throw new Error("Data user atau token tidak ditemukan");
      }

      // Update Zustand Store
      loginStore(user, token); 

      // Redirect berdasarkan role
      const role = user.role?.toLowerCase(); // Jaga-jaga jika backend kirim "Admin"
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "mekanik") navigate("/mekanik/job-assignment");
      else navigate("/customer/dashboard");
      
    } catch (err) {
      // err sekarang berisi string pesan error karena sudah di-throw di auth.api.js
      setError(typeof err === 'string' ? err : "Kamu salah please");
    } finally {
      // Apapun yang terjadi (sukses/gagal), matikan status loading
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">E-Bengkel</h2>
          <p className="text-gray-500">Silakan login untuk mengakses layanan</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="nama@email.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <Button type="submit" className="w-full py-3 mt-2" disabled={loading}>
            {loading ? "Sedang Memverifikasi..." : "Masuk"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}