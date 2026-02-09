import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// Ambil list approval berdasarkan ID Servis
export const getApprovalsByService = async (serviceId) => {
  const res = await axios.get(`${API_URL}/approvals/${serviceId}`, getAuthHeader());
  return res.data;
};

// Update status (Approve/Reject) oleh Customer
export const updateApprovalStatus = async (id, status) => {
  const res = await axios.put(`${API_URL}/approvals/${id}`, { status }, getAuthHeader());
  return res.data;
};

export const createApproval = async (data) => {
  const res = await axios.post(`${API_URL}/approvals`, data, getAuthHeader());
  return res.data;
  
};