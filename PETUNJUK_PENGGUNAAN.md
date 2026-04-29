# Petunjuk Penggunaan Sistem PPDB Digital

Aplikasi ini menggunakan **React** untuk antarmuka dan **Google Sheets** sebagai database melalui **Google Apps Script**.

## 1. Persiapan Google Spreadsheet
1. Buat Google Spreadsheet baru di Drive Anda.
2. Beri nama spreadsheet tersebut (misalnya: `Database PPDB`).
3. Klik menu **Extensions** > **Apps Script**.

## 2. Setup Google Apps Script
1. Hapus semua kode di editor Apps Script.
2. Buka file `src/backend-gas.js.txt` di folder project ini.
3. Salin seluruh isi kode (pastikan bagian komentar di hapus atau uncomment fungsi-fungsinya).
4. Jika Anda ingin membuat tabel otomatis, jalankan fungsi `setup()` di editor Apps Script satu kali.
5. Klik tombol **Deploy** > **New Deployment**.
6. Pilih type: **Web App**.
7. Deskripsi: `PPDB API`.
8. Execute as: **Me** (Email Anda).
9. Who has access: **Anyone**.
10. Klik **Deploy**.
11. Salin **Web App URL** yang muncul.

## 3. Menghubungkan Aplikasi
1. Buka file `.env` atau panel **Secrets** di AI Studio.
2. Masukkan URL yang Anda salin tadi ke variabel `VITE_GAS_URL`.
3. Refresh aplikasi. Sekarang data akan tersimpan ke Google Sheets Anda!

## 4. Penggunaan Aplikasi
- **Login Admin**: Gunakan username `admin` dan password `admin123`.
- **Dashboard**: Melihat ringkasan data siswa per tahun ajaran.
- **Input Data**: Masuk ke menu 'Input Baru'. NIS akan terisi otomatis berdasarkan tahun ajaran dan kelas yang dipilih, cukup masukkan 3 angka urutan manual terakhir.
- **Export Excel**: Klik tombol 'Excel' di menu Data Siswa untuk mengunduh laporan.

---
*Catatan: Jika `VITE_GAS_URL` tidak diisi, aplikasi akan menggunakan penyimpanan lokal browser (localStorage) sebagai simulasi.*
