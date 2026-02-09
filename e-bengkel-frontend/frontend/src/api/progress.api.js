import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const addServiceProgress = async (serviceId, description) => {
  const res = await axios.post(`${API_URL}/services/${serviceId}/progress`, { description }, getAuthHeader());
  return res.data;
};

export const getServiceProgress = async (serviceId) => {
  const res = await axios.get(`${API_URL}/services/${serviceId}/progress`, getAuthHeader());
  return res.data;
};

