# Project E-Bengkel (Ujikom 2026)

Aplikasi manajemen bengkel berbasis web untuk mempermudah pendataan servis 

## Tech Stack
* **Language:** JavaScript 
* **Framework:** Express
* **Database:** MySQL

##  Fitur
* Registrasi Pelanggan & Kendaraan
* Pencatatan Keluhan & Estimasi Biaya
* Update Status Servis (Proses/Selesai)
* Laporan Transaksi


## Cara Login
email: admin@gmail.com 
password: admin123
email: mekanik@gmail.com
password: mekanik123
email: budii@gmail.com
password: 123456

## Dokumentasi & Penjelasan Teknis

### 1. Fungsi Modul (Overview)
Modul **Manage Services** berfungsi untuk mengelola antrean servis secara real-time, mulai dari pendaftaran pelanggan hingga pencatatan keluhan dan cetak struk.

### 2. Alur Data (Frontend → Backend → Database)
* **Frontend:** Input data melalui `ServiceForm` dikelola oleh `useReducer` dan dikirim via **Axios**.
* **Backend:** Request diproses oleh **Controller** di Express.js dengan validasi keamanan.
* **Database:** **Sequelize/MySQL** menyimpan data ke tabel terkait dan mengirim respon balik ke UI.

### 3. Implementasi Loading & Error Handling
* **Loading State:** Menggunakan state boolean untuk menampilkan `Loader2` saat proses API berjalan.
* **Error Handling:** Menggunakan blok `try-catch` untuk menangkap error server dan menampilkannya melalui `AlertCircle`.

### 4. Operasi CRUD
* **GET:** Mengambil list antrean (fetchData).
* **POST:** Menambah antrean baru (handleFormSubmit).
* **PUT:** Memperbarui data berdasarkan `selectedId`.
* **DELETE:** Menghapus data antrean berdasarkan ID.
---
