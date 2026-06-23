import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPemilik = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('id_pemilik', res.data.id_pemilik);
      localStorage.setItem('nama_pemilik', res.data.nama_pemilik);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '480px' }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            Login <span style={{ color: 'var(--primary)' }}>Pemilik Kos</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Masuk untuk mengelola properti Anda</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-control"
              placeholder="Masukkan username Anda"
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
              placeholder="Masukkan password Anda"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button id="btn-login" type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Sedang Masuk...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPemilik;
