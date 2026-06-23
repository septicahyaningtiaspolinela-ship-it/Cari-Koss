# DOKUMEN RESEARCH AND DEVELOPMENT
# Laporan Final Project Pemrograman SQL II
*Perancangan dan implementasi aplikasi berbasis database relasional, mencakup analisis kebutuhan, perancangan basis data, implementasi, pengujian, dan deployment.*

| Informasi | Keterangan |
| --- | --- |
| **Judul Proyek** | CariKos |
| **Nama** | Septi Cahyaningtias |
| **NIM** | 24781026 |
| **Prodi / Kelas** | Manajemen Informatika |
| **Dosen** | M. Reza Redo Islami, S.Kom., M.T.I. |
| **Institusi** | Politeknik Negeri Lampung |
| **Tgl Mulai** | 2026-06-16 |
| **Tgl Selesai** | 2026-06-24 |

---

## DAFTAR ISI
I. Pendahuluan dan Analisis Kebutuhan
II. Perancangan Basis Data
III. Arsitektur Sistem dan Perancangan
IV. Implementasi
V. Deployment dan Hosting
VI. Pengujian Sistem
VII. Kesimpulan dan Saran
VIII. Lampiran

---

## BAB I - PENDAHULUAN DAN ANALISIS KEBUTUHAN

### 1.1 Latar Belakang
Kebutuhan akan tempat tinggal sementara (kos) sangat tinggi terutama bagi kalangan mahasiswa dan pekerja perantau. Namun, proses pencarian kos seringkali tidak efisien karena calon penyewa harus berkeliling mencari informasi secara langsung. Di sisi lain, pemilik kos juga kesulitan dalam mempromosikan kos mereka secara luas. Oleh karena itu, diperlukan sebuah sistem berbasis web yang dapat menjembatani pemilik kos dan pencari kos agar informasi dapat diakses dengan mudah, cepat, dan transparan.

### 1.2 Rumusan Masalah
1. Bagaimana cara memudahkan pencari kos dalam menemukan informasi kos yang sesuai dengan kriteria (harga, tipe, dan fasilitas)?
2. Bagaimana cara memfasilitasi pemilik kos untuk mengelola data kos dan ketersediaan kamar secara digital?

### 1.3 Tujuan Proyek
Membangun sebuah aplikasi web portal pencarian kos bernama "CariKos" yang memungkinkan pemilik kos untuk menambah dan mengelola data kos/kamar (CRUD), serta memungkinkan pencari kos untuk melihat daftar kos beserta status ketersediaan kamarnya secara *real-time*.

### 1.4 Ruang Lingkup — Dikerjakan
- Sistem autentikasi (Register dan Login) khusus untuk pemilik kos.
- Fitur CRUD (Create, Read, Update, Delete) data Kos oleh pemilik kos.
- Fitur CRUD data Kamar (penambahan nomor kamar dan status ketersediaannya) oleh pemilik kos.
- Halaman publik bagi pencari kos untuk melihat daftar seluruh kos, filter/pencarian, dan melihat detail kos berserta ketersediaan kamar.

### 1.5 Batasan — Tidak Dikerjakan
- Tidak mencakup sistem pembayaran atau transaksi sewa kos secara online (payment gateway).
- Tidak ada fitur chat real-time antara pencari dan pemilik kos (dialihkan via WhatsApp).
- Tidak ada fitur register/login untuk pencari kos (pengunjung dapat melihat data secara anonim).

### 1.6 Target Pengguna
- **Pencari Kos**: Mahasiswa, pekerja, atau masyarakat umum yang mencari tempat tinggal sementara.
- **Pemilik Kos**: Individu atau pihak yang memiliki usaha kos dan ingin mengiklankan serta mengelola ketersediaan kamarnya.

### 1.7 Manfaat
- **Bagi Pencari Kos**: Menghemat waktu dan tenaga dalam mencari kos karena informasi (harga, foto, fasilitas, ketersediaan) dapat diakses dari mana saja.
- **Bagi Pemilik Kos**: Memperluas jangkauan promosi kos dan mempermudah pengelolaan status kamar.

---

## BAB II - PERANCANGAN BASIS DATA

### 2.1 Skema Tabel dan Relasi

| KOLOM | TIPE DATA | PK | NOT NULL | FOREIGN KEY |
| --- | --- | :---: | :---: | --- |
| **Tabel: pemilik** | | | | |
| id_pemilik | SERIAL (INT) | YA | YA | |
| nama_pemilik | VARCHAR(100) | | YA | |
| username | VARCHAR(50) | | YA | |
| password | VARCHAR(255) | | YA | |
| **Tabel: kos** | | | | |
| id_kos | SERIAL (INT) | YA | YA | |
| id_pemilik | INT | | YA | `pemilik.id_pemilik` |
| nama_kos | VARCHAR(100) | | YA | |
| alamat_kos | TEXT | | YA | |
| tipe_kos | VARCHAR(20) | | YA | |
| harga_mulai_dari | INT | | YA | |
| periode_sewa | VARCHAR(20) | | YA | |
| fasilitas_umum | TEXT | | | |
| fasilitas_kamar | TEXT | | | |
| no_wa_pemilik | VARCHAR(20) | | YA | |
| foto_kos | VARCHAR(255) | | | |
| **Tabel: kamar** | | | | |
| id_kamar | SERIAL (INT) | YA | YA | |
| id_kos | INT | | YA | `kos.id_kos` |
| nomor_kamar | VARCHAR(20) | | YA | |
| status_kamar | VARCHAR(20) | | YA | |

### 2.2 DDL Lengkap

```sql
CREATE TABLE IF NOT EXISTS pemilik (
    id_pemilik SERIAL PRIMARY KEY,
    nama_pemilik VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS kos (
    id_kos SERIAL PRIMARY KEY,
    id_pemilik INT NOT NULL,
    nama_kos VARCHAR(100) NOT NULL,
    alamat_kos TEXT NOT NULL,
    tipe_kos VARCHAR(20) CHECK (tipe_kos IN ('Putra', 'Putri', 'Campur')) NOT NULL,
    harga_mulai_dari INT NOT NULL,
    periode_sewa VARCHAR(20) DEFAULT 'Bulan',
    fasilitas_umum TEXT,
    fasilitas_kamar TEXT,
    no_wa_pemilik VARCHAR(20) NOT NULL,
    foto_kos VARCHAR(255),
    FOREIGN KEY (id_pemilik) REFERENCES pemilik(id_pemilik) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS kamar (
    id_kamar SERIAL PRIMARY KEY,
    id_kos INT NOT NULL,
    nomor_kamar VARCHAR(20) NOT NULL,
    status_kamar VARCHAR(20) CHECK (status_kamar IN ('Kosong', 'Penuh')) NOT NULL DEFAULT 'Kosong',
    FOREIGN KEY (id_kos) REFERENCES kos(id_kos) ON DELETE CASCADE ON UPDATE CASCADE
);
```

### 2.3 Ringkasan Relasi (FK)
- `kos.id_pemilik -> pemilik.id_pemilik`
- `kamar.id_kos -> kos.id_kos`

### 2.4 Kamus Data

| TABEL | KOLOM | TIPE | KETERANGAN |
| --- | --- | --- | --- |
| pemilik | id_pemilik | SERIAL | Primary Key, Wajib diisi |
| pemilik | nama_pemilik | VARCHAR(100) | Wajib diisi |
| pemilik | username | VARCHAR(50) | Wajib diisi |
| pemilik | password | VARCHAR(255) | Wajib diisi |
| kos | id_kos | SERIAL | Primary Key, Wajib diisi |
| kos | id_pemilik | INT | Wajib diisi, FK -> pemilik.id_pemilik |
| kos | nama_kos | VARCHAR(100) | Wajib diisi |
| kos | alamat_kos | TEXT | Wajib diisi |
| kos | tipe_kos | VARCHAR(20) | Wajib diisi |
| kos | harga_mulai_dari | INT | Wajib diisi |
| kos | periode_sewa | VARCHAR(20) | Wajib diisi |
| kos | fasilitas_umum | TEXT | Opsional |
| kos | fasilitas_kamar | TEXT | Opsional |
| kos | no_wa_pemilik | VARCHAR(20) | Wajib diisi |
| kos | foto_kos | VARCHAR(255) | Opsional |
| kamar | id_kamar | SERIAL | Primary Key, Wajib diisi |
| kamar | id_kos | INT | Wajib diisi, FK -> kos.id_kos |
| kamar | nomor_kamar | VARCHAR(20) | Wajib diisi |
| kamar | status_kamar | VARCHAR(20) | Wajib diisi |

---

## BAB III - ARSITEKTUR SISTEM DAN PERANCANGAN

### 3.1 Arsitektur dan Tech Stack
- **Database**: PostgreSQL (via Supabase)
- **Backend API**: Node.js dengan framework Express.js
- **Frontend**: React.js (Vite)
- **Arsitektur**: Client-Server menggunakan RESTful API (Format JSON)

### 3.2 Struktur Folder Proyek
- `/backend`: Berisi file server (Node.js/Express).
  - `server.js`: Main routing dan endpoint API.
  - `db.js`: Konfigurasi koneksi database PostgreSQL.
  - `/uploads`: Folder penyimpanan aset foto kos.
- `/frontend`: Berisi antarmuka web (React).
  - `/src/pages`: Komponen halaman utama.
  - `/src/components`: Komponen modular UI.

### 3.3 Mockup / Wireframe Antarmuka
*(Silakan tambahkan gambar screenshot/mockup UI di sini).*

### 3.4 Alur Navigasi (User Flow)
- **Guest / Pencari Kos**: Halaman Utama -> Melihat Daftar Kos -> Klik Detail Kos -> Menghubungi via WA.
- **Pemilik Kos**: Halaman Login/Register -> Dashboard -> Tambah/Edit Kos -> Ubah Status Kamar -> Logout.

### 3.5 Tabel Rute / Endpoint

| HTTP Method | Endpoint | Keterangan | Autorisasi |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Mendaftarkan pemilik kos baru | Public |
| POST | `/api/auth/login` | Login pemilik kos (generate token) | Public |
| GET | `/api/kos` | Mengambil semua data kos | Public |
| GET | `/api/kos/:id` | Mengambil detail kos & kamarnya | Public |
| POST | `/api/kos` | Membuat data kos baru | Token JWT |
| GET | `/api/pemilik/kos` | Data kos milik user login | Token JWT |
| PUT | `/api/kos/:id` | Mengubah data kos | Token JWT |
| DELETE | `/api/kos/:id` | Menghapus data kos | Token JWT |
| POST | `/api/kamar` | Menambahkan kamar baru | Token JWT |
| PUT | `/api/kamar/:id` | Update status kamar (Kosong/Penuh) | Token JWT |
| DELETE | `/api/kamar/:id` | Menghapus data kamar | Token JWT |

---

## BAB IV - IMPLEMENTASI

### 4.1 Operasi CREATE
**Kueri SQL:**
```sql
INSERT INTO kos (id_pemilik, nama_kos, alamat_kos, tipe_kos, harga_mulai_dari, periode_sewa, fasilitas_umum, fasilitas_kamar, no_wa_pemilik, foto_kos) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
```

### 4.2 Operasi READ (dengan JOIN)
**Kueri SQL:**
```sql
SELECT k.*, 
    COALESCE(SUM(CASE WHEN km.status_kamar = 'Kosong' THEN 1 ELSE 0 END), 0) AS jumlah_kosong, 
    COALESCE(SUM(CASE WHEN km.status_kamar = 'Penuh' THEN 1 ELSE 0 END), 0) AS jumlah_penuh, 
    COUNT(km.id_kamar) AS total_kamar 
FROM kos k LEFT JOIN kamar km ON k.id_kos = km.id_kos 
GROUP BY k.id_kos;
```

### 4.3 Operasi UPDATE
**Kueri SQL:**
```sql
UPDATE kamar SET status_kamar = $1 WHERE id_kamar = $2 RETURNING *;
```

### 4.4 Operasi DELETE
**Kueri SQL:**
```sql
DELETE FROM kos WHERE id_kos = $1;
```

### 4.5 Dokumentasi Tampilan (Screenshot)
*(Silakan tempelkan screenshot aplikasi Anda di sini, seperti Halaman Utama dan Dashboard).*

---

## BAB V - DEPLOYMENT DAN HOSTING

### 5.1 Metode Hosting
- **Frontend**: [Isi dengan platform hosting (misal: Vercel / Netlify)]
- **Backend**: [Isi dengan platform hosting (misal: Render / Railway)]
- **Database**: Supabase

### 5.2 URL Deployment
- **Frontend**: [Link Hosting Web Frontend]
- **Backend API**: [Link Hosting API Backend]

### 5.3 Langkah Deployment
1. Upload/push *source code* ke repository GitHub.
2. Mengubah Base URL di frontend dari `localhost` menjadi URL produksi.
3. Deploy backend dan konfigurasi Environment Variables (`DATABASE_URL`, `JWT_SECRET`).
4. Deploy frontend dan hubungkan ke repository.

### 5.4 Perubahan Konfigurasi (Lokal ke Hosting)
- URL Database diganti ke URL Supabase Transaction Pooler (karena perubahan IPv4).
- Alamat pemanggilan API di *frontend* diubah ke domain backend *live*.

---

## BAB VI - PENGUJIAN SISTEM

### 6.1 Skenario dan Hasil Uji

*(Tambahkan Screenshot di tiap skenario)*

| Skenario Uji | Hasil Diharapkan | Status | Bukti Screenshot |
| --- | --- | --- | --- |
| Registrasi & Login | Pemilik dapat membuat akun dan login. | BERHASIL | *(Gambar)* |
| CRUD Data Kos | Pemilik dapat menambah, mengedit, dan menghapus kos. | BERHASIL | *(Gambar)* |
| Kelola Kamar | Pemilik dapat update status kamar menjadi Penuh/Kosong. | BERHASIL | *(Gambar)* |
| Tampilan Publik | Pencari kos dapat melihat data kos dan sisa kamar. | BERHASIL | *(Gambar)* |

### 6.2 Ringkasan Hasil Pengujian
Sistem berjalan normal. Fungsionalitas backend dan frontend berhasil terintegrasi, fitur keamanan JWT berfungsi, dan query relasional memberikan output sesuai.

### 6.3 Kendala dan Solusi
- **Kendala**: Koneksi ke database terputus di lokal (`ENOTFOUND Supabase`).
- **Solusi**: Menggunakan *Connection Pooler URL* Supabase untuk mendukung IPv4.

### 6.4 Kesimpulan Pengujian
Semua skenario pengujian fungsionalitas CRUD dan Autentikasi dinyatakan berhasil.

---

## BAB VII - KESIMPULAN DAN SARAN

### 7.1 Kesimpulan
Proyek "CariKos" berhasil mengimplementasikan aplikasi manajemen pencarian kos. Database PostgreSQL mampu menangani data relasional, memberikan kemudahan bagi pemilik kos untuk mengatur ketersediaan kamar, dan bagi pencari kos untuk menemukan kos.

### 7.2 Saran Pengembangan
- Integrasi peta rute (Google Maps API).
- Penambahan fitur review / ulasan pengguna.

---

## BAB VIII - LAMPIRAN

### A. DDL + DML Lengkap
(Terdapat pada Bab 2.2). DML dapat diakses langsung pada live database.

### B. Tautan Repository GitHub
- **[Masukkan Link Repository Anda di sini]**

### C. Tautan Video Demo (YouTube)
- **[Masukkan Link Video Demo YouTube Anda di sini]**

### D. Referensi
- Dokumentasi PostgreSQL & Supabase.
- Dokumentasi Express.js dan React.js.

### E. Pernyataan Orisinalitas dan Penggunaan AI
Dengan ini saya menyatakan bahwa aplikasi ini saya kerjakan sebagai Final Project Pemrograman SQL II. Penggunaan AI (Gemini) sebatas dimanfaatkan sebagai asisten (debugging error, merapikan dokumen), sedangkan logika aplikasi dan perancangan database adalah karya sendiri.
