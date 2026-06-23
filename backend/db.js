const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('supabase.co') ? { rejectUnauthorized: false } : false
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client. Pastikan database PostgreSQL berjalan.', err.stack);
  }
  console.log('Database connected successfully');
  release();
});

// Initialize database tables
const initDB = async () => {
  const queryText = `
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
  `;
  try {
    await pool.query(queryText);
    console.log('Tables initialized');
  } catch (err) {
    console.error('Error initializing tables', err);
  }
};

initDB();

module.exports = pool;
