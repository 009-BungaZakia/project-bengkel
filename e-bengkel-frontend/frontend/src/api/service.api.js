import axios from "axios";

// Hardcode URL untuk memastikan tidak ada double slash (//)
const API_URL = "http://localhost:3000/api";

// Helper untuk mengambil token dan header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};

/**
 * SOAL 4: READ (GET ALL)
 * Mengambil semua data servis beserta item/sparepart
 */
export const getAllServices = async () => {
  const res = await axios.get(`${API_URL}/services`, getAuthHeader());
  return res.data;
};

/**
 * Mengambil detail servis berdasarkan ID
 */
export const getServiceById = async (id) => {
  const res = await axios.get(`${API_URL}/services/${id}`, getAuthHeader());
  return res.data;
};

/**
 * SOAL 5: CREATE (POST)
 * Mendaftarkan antrean servis baru
 */
export const createService = async (data) => {
  const res = await axios.post(`${API_URL}/services`, data, getAuthHeader());
  return res.data;
};

/**
 * Update Progress (Assign Mekanik ke Servis)
 */
export const addServiceProgress = async (serviceId, data) => {
  const res = await axios.put(`${API_URL}/services/${serviceId}/assign`, data, getAuthHeader());
  return res.data;
};

/**
 * Update Status menjadi Selesai
 */
export const completeService = async (serviceId) => {
  const res = await axios.put(`${API_URL}/services/${serviceId}/complete`, {}, getAuthHeader());
  return res.data;
};

/**
 * Update status approval dari sisi Customer
 */
export const approveService = async (id, data) => {
  const res = await axios.put(`${API_URL}/services/${id}/approve`, data, getAuthHeader());
  return res.data;
};

/**
 * SOAL 6: DELETE
 * Menghapus data antrean servis
 */
// src/api/service.api.js

export const deleteService = async (id) => {
  const token = localStorage.getItem("token");
  // Pastikan tidak ada typo di URL ini
  return await axios.delete(`http://localhost:3000/api/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};