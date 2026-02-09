import axiosInstance from "./axiosConfig";

/**
 * Fungsi Login
 */
export const login = async (credentials) => {
  try {
    // HAPUS "/api" di depan "/auth/login" karena sudah ada di axiosConfig
    // Pastikan rutenya sesuai backend (biasanya /auth/login)
    const response = await axiosInstance.post("/auth/login", credentials);
    
    const loginData = response.data?.data;

    if (loginData && loginData.token) {
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));
    }
    
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Email atau password salah";
    throw errorMessage;
  }
};

/**
 * Fungsi Register Customer
 */
export const register = async (userData) => {
  try {
    // Rute ini sudah benar jika di backend adalah /api/auth/register
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registrasi gagal";
  }
};

/**
 * Fungsi Logout
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.replace("/login");
};