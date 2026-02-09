/**
 * Mengubah angka menjadi format Rupiah
 * Contoh: 50000 -> Rp 50.000
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Mengubah format tanggal database menjadi format lokal Indonesia
 * Contoh: 2023-12-25 -> 25 Desember 2023
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Format tanggal dan waktu lengkap
 * Contoh: 25 Desember 2023, 14:30
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date) + " WIB";
};