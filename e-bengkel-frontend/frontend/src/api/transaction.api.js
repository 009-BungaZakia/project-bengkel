import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

/**
 * 1. AMBIL SEMUA TRANSAKSI (Admin)
 */
export const getAllTransactions = async () => {
  try {
    const res = await axios.get(`${API_URL}/transaksi`, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("Gagal ambil transaksi:", err);
    throw err;
  }
};

/**
 * 2. AMBIL DETAIL TRANSAKSI
 * Penting untuk melihat rincian sparepart yang sudah di-approve
 */
export const getTransactionDetail = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/transaksi/${id}`, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("Gagal ambil detail transaksi:", err);
    throw err;
  }
};

/**
 * 3. BUAT TRANSAKSI BARU
 * Digunakan saat servis selesai dan invoice diterbitkan
 */
export const createTransaction = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/transaksi`, data, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("Gagal membuat transaksi:", err);
    throw err;
  }
};

/**
 * 4. DOWNLOAD PDF INVOICE
 * Menggunakan axios blob agar Header Authorization tetap terkirim
 */
export const downloadPdfInvoice = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/transaksi/${id}/pdf`, {
      ...getAuthHeader(),
      responseType: 'blob', // Penting: memberitahu axios ini data biner
    });

    // Buat link download sementara di browser
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Bersihkan memori
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Gagal download PDF:", err);
    throw err;
  }
};