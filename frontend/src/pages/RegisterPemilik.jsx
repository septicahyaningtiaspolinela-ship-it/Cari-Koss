import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPemilik = () => {
  const [form, setForm] = useState({ nama_pemilik: '', username: '', password: '', konfirmasi_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.konfirmasi_password) {
      return setError('Password dan konfirmasi password tidak cocok.');
    }
    if (form.password.length < 6) {
      return setError('Password minimal 6 karakter.');
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        nama_pemilik: form.nama_pemilik,
        username: form.username,
        password: form.password,
      });
      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '480px' }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            Daftar <span style={{ color: 'var(--primary)' }}>Pemilik Kos</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Buat akun untuk mulai mendaftarkan kos Anda</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nama_pemilik" className="form-label">Nama Lengkap</label>
            <input
              id="nama_pemilik"
              type="text"
              name="nama_pemilik"
              className="form-control"
              placeholder="Masukkan nama lengkap Anda"
              value={form.nama_pemilik}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-control"
              placeholder="Buat username unik Anda"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="konfirmasi_password" className="form-label">Konfirmasi Password</label>
            <input
              id="konfirmasi_password"
              type="password"
              name="konfirmasi_password"
              className="form-control"
              placeholder="Ketik ulang password Anda"
              value={form.konfirmasi_password}
              onChange={handleChange}
              required
            />
          </div>
          <button id="btn-register" type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Sedang Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          Sudah punya akun?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPemilik;
