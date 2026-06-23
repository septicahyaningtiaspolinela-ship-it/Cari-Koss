# Web Portal Cari Kos

Platform pencarian kos mahasiswa dengan fitur CRUD lengkap untuk pemilik kos.

## Tech Stack

- **Frontend:** React + Vite, Vanilla CSS
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL (siap terhubung ke Supabase)
- **Auth:** JWT (JSON Web Token)
- **Upload Foto:** Multer (lokal, siap migrasi ke Supabase Storage / Cloudinary)

## Struktur Folder

```
CRUD PROJECT SQL/
├── backend/
│   ├── uploads/          # Folder penyimpanan foto (dibuat otomatis)
│   ├── .env              # Variabel lingkungan (DATABASE_URL, JWT_SECRET, PORT)
│   ├── db.js             # Konfigurasi koneksi & inisialisasi tabel PostgreSQL
│   ├── server.js         # Entry point Express + semua endpoint REST API
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── KosCard.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Katalog kos + pencarian/filter
│   │   │   ├── DetailKos.jsx      # Detail kos + status kamar + tombol WA
│   │   │   ├── LoginPemilik.jsx   # Halaman login pemilik
│   │   │   ├── RegisterPemilik.jsx # Halaman registrasi pemilik
│   │   │   └── Dashboard.jsx      # CRUD kos & kelola kamar
│   │   ├── App.jsx                # Routing React Router DOM
│   │   ├── main.jsx
│   │   └── index.css              # Design system (dark mode, glassmorphism)
│   ├── index.html
│   └── package.json
└── PRD_Web_Pencarian_Kos_v2.pdf
```

## Setup & Cara Menjalankan

### 1. Konfigurasi Database
Edit file `backend/.env` dan ganti `DATABASE_URL` dengan URL PostgreSQL / Supabase Anda:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=supersecretjwtkey_portal_kos
```

### 2. Jalankan Backend
```bash
cd backend
npm install
npm run dev
```
Server berjalan di: `http://localhost:5000`

> Tabel database akan dibuat otomatis saat server pertama kali dijalankan.

### 3. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi berjalan di: `http://localhost:5173`

## Endpoint API

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/api/auth/register` | Public | Registrasi pemilik baru |
| POST | `/api/auth/login` | Public | Login pemilik |
| GET | `/api/kos` | Public | Ambil semua data kos |
| GET | `/api/kos/:id` | Public | Ambil detail kos + kamar |
| POST | `/api/kos` | 🔒 Auth | Tambah kos baru |
| PUT | `/api/kos/:id` | 🔒 Auth | Edit data kos |
| DELETE | `/api/kos/:id` | 🔒 Auth | Hapus kos |
| GET | `/api/pemilik/kos` | 🔒 Auth | Kos milik pemilik login |
| POST | `/api/kamar` | 🔒 Auth | Tambah kamar |
| PUT | `/api/kamar/:id` | 🔒 Auth | Update status kamar |
| DELETE | `/api/kamar/:id` | 🔒 Auth | Hapus kamar |
