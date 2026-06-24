import { Link } from 'react-router-dom';

const KosCard = ({ kos }) => {
  const imageUrl = kos.foto_kos
    ? (kos.foto_kos.startsWith('http') ? kos.foto_kos : `${import.meta.env.VITE_API_URL}${kos.foto_kos}`)
    : 'https://via.placeholder.com/400x300?text=Kos+Tidak+Ada+Foto';

  const jumlahKosong = Number(kos.jumlah_kosong) || 0;
  const jumlahPenuh = Number(kos.jumlah_penuh) || 0;
  const totalKamar = Number(kos.total_kamar) || 0;

  // Tentukan badge ketersediaan
  let availBadge;
  if (totalKamar === 0) {
    availBadge = { label: 'Belum ada kamar', bg: '#f5f2ed', color: 'var(--text-secondary)', border: '#d1ccc6' };
  } else if (jumlahKosong === 0) {
    availBadge = { label: 'Full', bg: '#fdf0f0', color: 'var(--danger)', border: '#e8b4b4' };
  } else {
    availBadge = { label: `${jumlahKosong} Kamar Kosong`, bg: '#f0f7f2', color: 'var(--success)', border: '#b4d4bf' };
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={kos.nama_kos}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.2rem' }}>{kos.nama_kos}</h3>

        {/* Badge Tipe + Ketersediaan Kamar */}
        <div className="flex gap-4" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
          background:
            kos.tipe_kos === 'Putra' ? '#edf3f8' :
            kos.tipe_kos === 'Putri' ? '#f8f0ee' :
            '#f0f5f1',
          color:
            kos.tipe_kos === 'Putra' ? '#4a7fa0' :
            kos.tipe_kos === 'Putri' ? '#9b5a50' :
            '#4a7a5c',
          border: '1px solid',
          borderColor:
            kos.tipe_kos === 'Putra' ? '#bdd6e8' :
            kos.tipe_kos === 'Putri' ? '#e8c4bc' :
            '#bdd8c4',
          padding: '0.2rem 0.6rem',
          borderRadius: '4px',
          fontSize: '0.78rem',
          fontWeight: '600'
        }}>
            {kos.tipe_kos}
          </span>
          <span style={{
            background: availBadge.bg,
            color: availBadge.color,
            padding: '0.2rem 0.6rem', borderRadius: '4px',
            fontSize: '0.78rem', fontWeight: '600',
            border: `1px solid ${availBadge.border || availBadge.color}`
          }}>
            {availBadge.label}
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem', flexGrow: 1 }}>
          📍 {kos.alamat_kos.length > 55 ? kos.alamat_kos.substring(0, 55) + '...' : kos.alamat_kos}
        </p>
        <p style={{ fontWeight: '700', color: 'var(--success)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
          Rp {Number(kos.harga_mulai_dari).toLocaleString('id-ID')}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}> / {kos.periode_sewa?.toLowerCase() || 'bulan'}</span>
        </p>
        <Link to={`/kos/${kos.id_kos}`} className="btn btn-outline" style={{ width: '100%' }}>
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default KosCard;
