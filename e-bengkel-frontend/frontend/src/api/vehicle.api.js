import axiosInstance from "./axiosConfig";

// 1. Ambil semua kendaraan (Pastikan pakai /vehicles sesuai router)
export const getAllVehicles = async () => {
  try {
    const response = await axiosInstance.get("/vehicles");
    // Pastikan mengembalikan data yang benar sesuai struktur response
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data?.message || "Gagal mengambil data kendaraan";
  }
};

// 2. Alias untuk konsistensi di halaman Customer
export const getMyVehicles = async () => {
  // Pastikan endpoint-nya sama dengan yang ada di Laravel/NodeJS kamu
  return await axiosInstance.get("/customers/vehicle"); 
};

// 3. Tambah kendaraan baru
export const createVehicle = async (vehicleData) => {
  try {
    const response = await axiosInstance.post("/vehicles", vehicleData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Gagal menambah kendaraan";
  }
};

// 4. Update data kendaraan
export const updateVehicle = async (id, vehicleData) => {
  try {
    const response = await axiosInstance.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Gagal update kendaraan";
  }
};

// 5. Hapus kendaraan
export const deleteVehicle = async (id) => {
  try {
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Gagal menghapus kendaraan";
  }
};

