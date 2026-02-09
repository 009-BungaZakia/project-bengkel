import React from "react";
import { Navigate, Outlet } from "react-router-dom";


/**
 * @param {Array} allowedRoles - Role yang diizinkan (contoh: ['admin', 'mekanik'])
 */
const PrivateRoute = ({ allowedRoles }) => {
  // 1. Ambil token dan data user dari localStorage
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // 2. Jika tidak ada token, tendang ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Jika role user tidak ada dalam daftar allowedRoles, tendang ke dashboard masing-masing
  // (Mencegah Customer buka halaman Admin)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Arahkan ke dashboard yang sesuai dengan role mereka sendiri
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' 
                       : user?.role === 'mekanik' ? '/mekanik/dashboard' 
                       : '/customer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // 4. Jika semua oke, izinkan masuk ke halaman yang dituju
  return <Outlet />;
};

export default PrivateRoute;