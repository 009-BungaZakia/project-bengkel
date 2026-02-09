import axios from "axios";

// Membuat instance axios
const axiosInstance = axios.create({
  // Tambahkan /api di akhir port 3000
  baseURL: "http://localhost:3000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor untuk menempelkan Token di setiap Request
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (disimpan saat login)
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani Error Response (misal: Token Expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika backend mengirim 401 (Unauthorized), paksa logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;