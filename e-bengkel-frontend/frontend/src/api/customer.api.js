import axiosInstance from "./axiosConfig";

export const getAllCustomers = () => axiosInstance.get("/customers");
export const createCustomer = (data) => axiosInstance.post("/customers", data);
// Tambahkan dua ini:
export const updateCustomer = (id, data) => axiosInstance.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => axiosInstance.delete(`/customers/${id}`);
