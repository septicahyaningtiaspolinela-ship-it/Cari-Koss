import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DetailKos = () => {
  const { id } = useParams();
  const [kos, setKos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/kos/${id}`);
        setKos(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Memuat...</div>;
  if (!kos) return <div className="text-center mt-8">Kos tidak ditemukan</div>;

  const imageUrl = kos.foto_kos
    ? `http://localhost:5000${kos.foto_kos}`
    : 'https://via.placeholder.com/800x400?text=Kos+Tidak+Ada+Foto';

  // Format WhatsApp number
  let waNumber = kos.no_wa_pemilik.replace(/\D/g, '');
  if (waNumber.startsWith('0')) {
    waNumber = '62' + waNumber.substring(1);
  }
  
  const waMessage = `Halo, selamat pagi/siang/sore. Saya tertarik dengan unit ${kos.nama_kos}. Jika diperkenankan, bolehkah Anda mengirimkan video singkat mengenai detail kamar yang masih kosong saat ini? Terima kasih.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  // Hitung harga berdasarkan periode_sewa yang tersimpan di DB
  const hargaAsli = Number(kos.harga_mulai_dari);
  const periodeAsli = kos.periode_sewa?.toLowerCase() || 'bulan'; // 'bulan' atau 'tahun'

  let currentPrice, catatanKonversi;
  if (isYearly) {
    if (periodeAsli === 'tahun') {
      currentPrice = hargaAsli;       // sudah tahunan, tampilkan apa adanya
      catatanKonversi = null;
    } else {
      currentPrice = hargaAsli * 12;  // bulanan → tahunan
      catatanKonversi = `*Estimasi: Rp ${hargaAsli.toLocaleString('id-ID')} × 12 bulan`;
    }
  } else {
    if (periodeAsli === 'bulan') {
      currentPrice = hargaAsli;       // sudah bulanan, tampilkan apa adanya
      catatanKonversi = null;
    } else {
      currentPrice = Math.round(hargaAsli / 12); // tahunan → bulanan
      catatanKonversi = `*Estimasi dari harga tahunan Rp ${hargaAsli.toLocaleString('id-ID')} ÷ 12`;
    }
  }

  return (
    <div className="container animate-fade-in">
      <Link to="/" className="btn btn-outline mb-4">&larr; Kembali ke Katalog</Link>

      <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
        <img src={imageUrl} alt={kos.nama_kos} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />

        <div style={{ padding: '2rem' }}>
          <div className="flex justify-between items-center mb-4">
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{kos.nama_kos}</h1>
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
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              {'Tipe: '}{kos.tipe_kos}
            </span>
          </div>

          <div className="grid grid-cols-1 md-grid-cols-2 mb-8">
            <div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Alamat Lengkap</h3>
              <p className="mb-4">{kos.alamat_kos}</p>

              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Fasilitas Umum</h3>
              <p className="mb-4">{kos.fasilitas_umum || 'Tidak ada info fasilitas umum'}</p>

              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Fasilitas Kamar</h3>
              <p className="mb-4">{kos.fasilitas_kamar || 'Tidak ada info fasilitas kamar'}</p>

              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Ketersediaan Kamar</h3>
              {kos.kamar && kos.kamar.filter(k => k.status_kamar === 'Kosong').length > 0 ? (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {kos.kamar.filter(k => k.status_kamar === 'Kosong').map(k => (
                    <span key={k.id_kamar} style={{ background: '#f0f7f2', color: 'var(--success)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: '600', border: '1px solid #b4d4bf', fontSize: '0.88rem' }}>
                      Kamar {k.nomor_kamar}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Maaf, tidak ada kamar kosong saat ini.</p>
              )}
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#faf8f5', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--surface-light)' }}>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Harga Mulai Dari</h3>

              {/* Toggle Bulanan / Tahunan */}
              <div style={{ display: 'inline-flex', background: 'var(--surface-light)', borderRadius: '10px', padding: '4px', alignSelf: 'flex-start' }}>
                <button
                  onClick={() => setIsYearly(false)}
                  style={{
                    padding: '0.4rem 1.1rem', borderRadius: '7px', border: 'none', cursor: 'pointer',
                    fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s ease',
                    background: !isYearly ? 'var(--primary)' : 'transparent',
                    color: !isYearly ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  / Bulan
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  style={{
                    padding: '0.4rem 1.1rem', borderRadius: '7px', border: 'none', cursor: 'pointer',
                    fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s ease',
                    background: isYearly ? 'var(--primary)' : 'transparent',
                    color: isYearly ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  / Tahun
                </button>
              </div>

              {/* Harga */}
              <div>
                <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.25rem', lineHeight: 1.2 }}>
                  Rp {currentPrice.toLocaleString('id-ID')}
                  <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                    {' '}/ {isYearly ? 'tahun' : 'bulan'}
                  </span>
                </p>
                {catatanKonversi && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                    {catatanKonversi}
                  </p>
                )}
                {isYearly && periodeAsli === 'bulan' && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--success)', background: 'rgba(16,185,129,0.12)', padding: '0.35rem 0.75rem', borderRadius: '6px', display: 'inline-block', marginTop: '0.5rem', fontWeight: '600' }}>
                    💡 Tanya pemilik soal promo sewa tahunan!
                  </p>
                )}
              </div>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', textAlign: 'center' }}>
                <i className="fab fa-whatsapp" style={{ marginRight: '0.5rem' }}></i> Hubungi Pemilik (WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKos;
