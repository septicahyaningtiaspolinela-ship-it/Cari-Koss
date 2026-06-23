const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const pool = require('./db');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up Multer for local file storage (Sebagai fallback / sementara sebelum integrasi Cloudinary/Supabase)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
// Serve static files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware for auth
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token tidak valid.' });
  }
};

// ---------------- AUTH ROUTES ----------------

// Register Pemilik
app.post('/api/auth/register', async (req, res) => {
  const { nama_pemilik, username, password } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM pemilik WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await pool.query(
      'INSERT INTO pemilik (nama_pemilik, username, password) VALUES ($1, $2, $3) RETURNING id_pemilik, nama_pemilik, username',
      [nama_pemilik, username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Pemilik
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM pemilik WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Username tidak ditemukan' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah' });
    
    const token = jwt.sign({ id_pemilik: user.id_pemilik }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, id_pemilik: user.id_pemilik, nama_pemilik: user.nama_pemilik });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PUBLIC KOS ROUTES ----------------

// Get All Kos (dengan jumlah kamar kosong & penuh)
app.get('/api/kos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        k.*,
        COALESCE(SUM(CASE WHEN km.status_kamar = 'Kosong' THEN 1 ELSE 0 END), 0) AS jumlah_kosong,
        COALESCE(SUM(CASE WHEN km.status_kamar = 'Penuh' THEN 1 ELSE 0 END), 0) AS jumlah_penuh,
        COUNT(km.id_kamar) AS total_kamar
      FROM kos k
      LEFT JOIN kamar km ON k.id_kos = km.id_kos
      GROUP BY k.id_kos
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Detail Kos with Kamar
app.get('/api/kos/:id', async (req, res) => {
  try {
    const kosResult = await pool.query('SELECT * FROM kos WHERE id_kos = $1', [req.params.id]);
    if (kosResult.rows.length === 0) return res.status(404).json({ message: 'Kos tidak ditemukan' });
    
    const kamarResult = await pool.query('SELECT * FROM kamar WHERE id_kos = $1', [req.params.id]);
    
    res.json({ ...kosResult.rows[0], kamar: kamarResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PROTECTED KOS ROUTES ----------------

// Create Kos
app.post('/api/kos', authenticate, upload.single('foto_kos'), async (req, res) => {
  const { nama_kos, alamat_kos, tipe_kos, harga_mulai_dari, periode_sewa, fasilitas_umum, fasilitas_kamar, no_wa_pemilik } = req.body;
  const id_pemilik = req.user.id_pemilik;
  const foto_kos = req.file ? `/uploads/${req.file.filename}` : null; // TODO: Ubah ke URL Supabase Storage nantinya
  
  try {
    const result = await pool.query(
      'INSERT INTO kos (id_pemilik, nama_kos, alamat_kos, tipe_kos, harga_mulai_dari, periode_sewa, fasilitas_umum, fasilitas_kamar, no_wa_pemilik, foto_kos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [id_pemilik, nama_kos, alamat_kos, tipe_kos, harga_mulai_dari, periode_sewa || 'Bulan', fasilitas_umum, fasilitas_kamar, no_wa_pemilik, foto_kos]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Kos by Pemilik (Dashboard)
app.get('/api/pemilik/kos', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kos WHERE id_pemilik = $1', [req.user.id_pemilik]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Kos
app.put('/api/kos/:id', authenticate, upload.single('foto_kos'), async (req, res) => {
  const { nama_kos, alamat_kos, tipe_kos, harga_mulai_dari, periode_sewa, fasilitas_umum, fasilitas_kamar, no_wa_pemilik } = req.body;
  const id_pemilik = req.user.id_pemilik;
  
  try {
    // Check ownership
    const check = await pool.query('SELECT * FROM kos WHERE id_kos = $1 AND id_pemilik = $2', [req.params.id, id_pemilik]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Tidak memiliki izin' });
    
    let query = 'UPDATE kos SET nama_kos=$1, alamat_kos=$2, tipe_kos=$3, harga_mulai_dari=$4, periode_sewa=$5, fasilitas_umum=$6, fasilitas_kamar=$7, no_wa_pemilik=$8';
    let values = [nama_kos, alamat_kos, tipe_kos, harga_mulai_dari, periode_sewa || 'Bulan', fasilitas_umum, fasilitas_kamar, no_wa_pemilik];
    
    if (req.file) {
      query += ', foto_kos=$9 WHERE id_kos=$10 RETURNING *';
      values.push(`/uploads/${req.file.filename}`, req.params.id);
    } else {
      query += ' WHERE id_kos=$9 RETURNING *';
      values.push(req.params.id);
    }
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Kos
app.delete('/api/kos/:id', authenticate, async (req, res) => {
  try {
    const check = await pool.query('SELECT * FROM kos WHERE id_kos = $1 AND id_pemilik = $2', [req.params.id, req.user.id_pemilik]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Tidak memiliki izin' });
    
    await pool.query('DELETE FROM kos WHERE id_kos = $1', [req.params.id]);
    res.json({ message: 'Kos berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PROTECTED KAMAR ROUTES ----------------

// Create Kamar
app.post('/api/kamar', authenticate, async (req, res) => {
  const { id_kos, nomor_kamar, status_kamar } = req.body;
  try {
    // Check ownership
    const check = await pool.query('SELECT * FROM kos WHERE id_kos = $1 AND id_pemilik = $2', [id_kos, req.user.id_pemilik]);
    if (check.rows.length === 0) return res.status(403).json({ message: 'Tidak memiliki izin' });
    
    const result = await pool.query(
      'INSERT INTO kamar (id_kos, nomor_kamar, status_kamar) VALUES ($1, $2, $3) RETURNING *',
      [id_kos, nomor_kamar, status_kamar || 'Kosong']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Status Kamar
app.put('/api/kamar/:id', authenticate, async (req, res) => {
  const { status_kamar } = req.body;
  try {
    // Check ownership by joining kos
    const check = await pool.query(
      'SELECT k.* FROM kamar km JOIN kos k ON km.id_kos = k.id_kos WHERE km.id_kamar = $1 AND k.id_pemilik = $2', 
      [req.params.id, req.user.id_pemilik]
    );
    if (check.rows.length === 0) return res.status(403).json({ message: 'Tidak memiliki izin' });
    
    const result = await pool.query(
      'UPDATE kamar SET status_kamar = $1 WHERE id_kamar = $2 RETURNING *',
      [status_kamar, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Kamar
app.delete('/api/kamar/:id', authenticate, async (req, res) => {
  try {
    // Check ownership
    const check = await pool.query(
      'SELECT k.* FROM kamar km JOIN kos k ON km.id_kos = k.id_kos WHERE km.id_kamar = $1 AND k.id_pemilik = $2', 
      [req.params.id, req.user.id_pemilik]
    );
    if (check.rows.length === 0) return res.status(403).json({ message: 'Tidak memiliki izin' });
    
    await pool.query('DELETE FROM kamar WHERE id_kamar = $1', [req.params.id]);
    res.json({ message: 'Kamar berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------

// Create uploads directory if not exists
const fs = require('fs');
if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
