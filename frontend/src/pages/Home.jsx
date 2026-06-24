import { useState, useEffect } from 'react';
import axios from 'axios';
import KosCard from '../components/KosCard';

const Home = () => {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState('');

  useEffect(() => {
    const fetchKos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/kos`);
        setKosList(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching kos:', err);
        setLoading(false);
      }
    };
    fetchKos();
  }, []);

  const filteredKos = kosList.filter(kos => {
    const matchName = kos.nama_kos.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAddress = kos.alamat_kos.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterTipe ? kos.tipe_kos === filterTipe : true;
    return (matchName || matchAddress) && matchType;
  });

  return (
    <div className="container">
      <div style={{ background: '#ffffff', borderRadius: '14px', padding: '2.5rem 2rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid var(--surface-light)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Portal Pencarian Hunian</p>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', fontWeight: '700' }}>
          Temukan Kos Idealmu
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          Cari berdasarkan nama, alamat, atau spesifikasi.
        </p>
        
        <div className="flex gap-4" style={{ maxWidth: '800px', margin: '0 auto', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Cari nama atau alamat kos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, minWidth: '250px' }}
          />
        </div>

        {/* Filter Tipe — Pill Buttons */}
        <div className="flex gap-4" style={{ justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Semua Tipe', value: '', color: 'var(--primary)' },
            { label: 'Putra',      value: 'Putra',  color: '#8aacbf' },
            { label: 'Putri',      value: 'Putri',  color: '#c4968d' },
            { label: 'Campur',     value: 'Campur', color: 'var(--primary)' },
          ].map(({ label, value, color }) => (
            <button
              key={value}
              onClick={() => setFilterTipe(value)}
              style={{
                padding: '0.4rem 1.1rem',
                borderRadius: '99px',
                border: `1.5px solid ${filterTipe === value ? color : 'var(--surface-light)'}`,
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.88rem',
                letterSpacing: '0.01em',
                transition: 'all 0.2s ease',
                background: filterTipe === value
                  ? `${color}22`
                  : 'transparent',
                color: filterTipe === value ? color : 'var(--text-secondary)',
                boxShadow: filterTipe === value ? `0 2px 10px ${color}33` : 'none',
                transform: filterTipe === value ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-8">
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--surface-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p className="mt-4">Memuat data kos...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          <p className="mb-4 text-secondary">Menampilkan {filteredKos.length} kos</p>
          {filteredKos.length > 0 ? (
            <div className="grid grid-cols-1 md-grid-cols-2 grid-cols-3">
              {filteredKos.map(kos => (
                <KosCard key={kos.id_kos} kos={kos} />
              ))}
            </div>
          ) : (
            <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Tidak ada kos yang cocok dengan pencarian Anda.</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
