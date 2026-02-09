import axiosInstance from "./axiosConfig";

// Ambil semua servis yang ditugaskan ke mekanik ini
export const getMechanicJobs = async () => {
  return await axiosInstance.get("/services/mechanic");
};

export const updateJobStatus = async (id, payload) => {
  return await axiosInstance.put(`/services/${id}/status`, payload);
};

export const requestSparepart = async (id, data) => {
  return await axiosInstance.post(`/services/${id}/request-part`, data);
};

