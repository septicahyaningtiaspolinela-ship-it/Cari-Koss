import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const nama_pemilik = localStorage.getItem('nama_pemilik');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id_pemilik');
    localStorage.removeItem('nama_pemilik');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#ffffff', borderBottom: '1px solid var(--surface-light)', margin: '0', padding: '0.85rem 0', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div className="container flex justify-between items-center">
        <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Cari<span style={{ color: 'var(--primary)' }}>Kos</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="btn btn-outline" style={{ border: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Beranda</Link>
          {token ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Halo, {nama_pemilik}</span>
              <Link to="/dashboard" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Login Pemilik</Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Daftar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
