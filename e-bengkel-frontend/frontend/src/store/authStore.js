import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,    // Menyimpan data user (nama, role, id)
      token: null,   // Menyimpan JWT Token
      isAuthenticated: false,

      // Fungsi untuk menyimpan data setelah login sukses
      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        });
        // Simpan token ke localStorage juga untuk Axios Interceptor
        localStorage.setItem("token", token);
      },

      // Fungsi untuk hapus data saat logout
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("token");
      },
    }),
    {
      name: "auth-storage", // Nama kunci di localStorage
    }
  )
);

export default useAuthStore;