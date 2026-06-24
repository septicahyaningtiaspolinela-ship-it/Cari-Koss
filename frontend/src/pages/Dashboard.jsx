import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Confirm Modal ──
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeInOverlay 0.2s ease'
      }}
    >
      <div style={{
        background: 'var(--surface, #fff)',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.15)',
        animation: 'scaleInModal 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        textAlign: 'center'
      }}>
        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(239,68,68,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '2rem'
        }}>
          🗑️
        </div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary, #1a1a1a)' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-secondary, #666)', fontSize: '0.92rem', margin: '0 0 1.75rem', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.65rem 1.25rem', borderRadius: '8px',
              border: '1px solid var(--surface-light, #ddd)',
              background: 'transparent', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: '600',
              color: 'var(--text-secondary, #555)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '0.65rem 1.25rem', borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
              color: '#fff', boxShadow: '0 4px 12px rgba(239,68,68,0.35)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(239,68,68,0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.35)'; }}
          >
            Ya, Hapus!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleInModal { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

const API = 'http://localhost:5000/api';

// ✅ KosForm dipindahkan ke LUAR Dashboard agar tidak di-remount setiap render
const KosForm = ({ kosForm, onChange, onSubmit, onCancel, isEdit = false }) => (
  <form onSubmit={onSubmit}>
    <div className="grid grid-cols-1 md-grid-cols-2">
      <div className="form-group">
        <label className="form-label">Nama Kos</label>
        <input
          type="text"
          name="nama_kos"
          className="form-control"
          placeholder="Contoh: Kos Melati"
          value={kosForm.nama_kos}
          onChange={onChange}
          required
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
      <div className="form-group">
        <label className="form-label">Tipe Kos</label>
        <select
          name="tipe_kos"
          className="form-control"
          value={kosForm.tipe_kos}
          onChange={onChange}
          style={{
            background: kosForm.tipe_kos === 'Putra' ? 'rgba(107,138,163,0.15)' : 
                kosForm.tipe_kos === 'Putri' ? 'rgba(176,139,130,0.15)' : 
                'rgba(124,152,133,0.15)',
    color: kosForm.tipe_kos === 'Putra' ? '#8aacbf' : 
           kosForm.tipe_kos === 'Putri' ? '#c4968d' : 
           'var(--primary)',
    fontWeight: '600',
    border: `1px solid ${kosForm.tipe_kos === 'Putra' ? '#8aacbf' : kosForm.tipe_kos === 'Putri' ? '#c4968d' : 'var(--primary)'}`
          }}
        >
          <option value="Putra">Putra</option>
          <option value="Putri">Putri</option>
          <option value="Campur">Campur</option>
        </select>
      </div>
          <div className="form-group">
            <label className="form-label">Harga Mulai Dari</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="harga_mulai_dari"
                className="form-control"
                placeholder="Contoh: 800000"
                value={kosForm.harga_mulai_dari}
                onChange={onChange}
                required
                min="0"
                step="1"
                style={{ flex: 1 }}
              />
              <select
                name="periode_sewa"
                className="form-control"
                value={kosForm.periode_sewa || 'Bulan'}
                onChange={onChange}
                style={{ width: '120px' }}
              >
                <option value="Bulan">/ Bulan</option>
                <option value="Tahun">/ Tahun</option>
              </select>
            </div>
            {kosForm.harga_mulai_dari && kosForm.periode_sewa === 'Bulan' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                Setara Rp {(Number(kosForm.harga_mulai_dari) * 12).toLocaleString('id-ID')} / tahun
              </p>
            )}
            {kosForm.harga_mulai_dari && kosForm.periode_sewa === 'Tahun' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                Setara ~Rp {Math.round(Number(kosForm.harga_mulai_dari) / 12).toLocaleString('id-ID')} / bulan
              </p>
            )}
          </div>
    </div>
    <div className="form-group">
      <label className="form-label">Alamat Lengkap</label>
      <textarea
        name="alamat_kos"
        className="form-control"
        rows="3"
        placeholder="Masukkan alamat lengkap kos..."
        value={kosForm.alamat_kos}
        onChange={onChange}
        required
        style={{ resize: 'vertical' }}
      ></textarea>
    </div>
    <div className="form-group">
      <label className="form-label">No. WhatsApp Pemilik</label>
      <input
        type="text"
        name="no_wa_pemilik"
        className="form-control"
        placeholder="Contoh: 08123456789"
        value={kosForm.no_wa_pemilik}
        onChange={onChange}
        required
      />
    </div>
    <div className="form-group">
      <label className="form-label">Fasilitas Umum</label>
      <textarea
        name="fasilitas_umum"
        className="form-control"
        rows="3"
        placeholder="Contoh: WiFi, AC, Parkir, Dapur bersama..."
        value={kosForm.fasilitas_umum}
        onChange={onChange}
        style={{ resize: 'vertical' }}
      ></textarea>
    </div>
    <div className="form-group">
      <label className="form-label">Fasilitas Kamar</label>
      <textarea
        name="fasilitas_kamar"
        className="form-control"
        rows="3"
        placeholder="Contoh: Kasur, Lemari, Meja Belajar, Kamar Mandi Dalam..."
        value={kosForm.fasilitas_kamar || ''}
        onChange={onChange}
        style={{ resize: 'vertical' }}
      ></textarea>
    </div>
    <div className="form-group">
      <label className="form-label">
        Foto Kos {isEdit && '(Kosongkan jika tidak ingin mengganti foto)'}
      </label>
      <input
        type="file"
        name="foto"
        className="form-control"
        accept="image/*"
        onChange={onChange}
        style={{ padding: '0.5rem' }}
      />
    </div>
    <div className="flex gap-4">
      <button type="submit" className="btn btn-primary">
        {isEdit ? 'Simpan Perubahan' : 'Tambah Kos'}
      </button>
      <button type="button" className="btn btn-outline" onClick={onCancel}>
        Batal
      </button>
    </div>
  </form>
);

// ─────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // list | tambah | edit | kamar
  const [selectedKos, setSelectedKos] = useState(null);
  const [notif, setNotif] = useState({ msg: '', type: '' });

  // ── Confirm Modal ──
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const emptyKosForm = {
    nama_kos: '', alamat_kos: '', tipe_kos: 'Putra',
    harga_mulai_dari: '', periode_sewa: 'Bulan', fasilitas_umum: '', fasilitas_kamar: '', no_wa_pemilik: '', foto: null
  };
  const [kosForm, setKosForm] = useState(emptyKosForm);
  const [kamarForm, setKamarForm] = useState({ nomor_kamar: '', status_kamar: 'Kosong' });
  const [selectedKosKamar, setSelectedKosKamar] = useState(null);
  const [kamarList, setKamarList] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchKos();
  }, []);

  const showNotif = (msg, type = 'success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif({ msg: '', type: '' }), 3000);
  };

  const fetchKos = async () => {
    try {
      const res = await axios.get(`${API}/pemilik/kos`, { headers });
      setKosList(res.data);
    } catch (err) {
      showNotif('Gagal memuat data kos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchKamar = async (id_kos) => {
    const res = await axios.get(`${API}/kos/${id_kos}`);
    setKamarList(res.data.kamar || []);
  };

  // ── Kos Form Change ──
  const handleKosFormChange = (e) => {
    if (e.target.name === 'foto') {
      setKosForm(prev => ({ ...prev, foto: e.target.files[0] }));
    } else {
      setKosForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // ── Kos CRUD ──
  const buildFormData = () => {
    const formData = new FormData();
    Object.keys(kosForm).forEach(k => {
      if (k === 'foto' && kosForm.foto) formData.append('foto_kos', kosForm.foto);
      else if (k !== 'foto') formData.append(k, kosForm[k]);
    });
    return formData;
  };

  const handleAddKos = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/kos`, buildFormData(), {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      showNotif('Kos berhasil ditambahkan!');
      setKosForm(emptyKosForm);
      setActiveTab('list');
      fetchKos();
    } catch (err) {
      showNotif(err.response?.data?.message || 'Gagal menambahkan kos.', 'error');
    }
  };

  const handleEditKos = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/kos/${selectedKos.id_kos}`, buildFormData(), {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      showNotif('Kos berhasil diperbarui!');
      setActiveTab('list');
      fetchKos();
    } catch (err) {
      showNotif(err.response?.data?.message || 'Gagal memperbarui kos.', 'error');
    }
  };

  const handleDeleteKos = (id_kos) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Kos?',
      message: 'Yakin ingin menghapus kos ini? Semua kamar yang terdaftar juga akan ikut terhapus secara permanen.',
      onConfirm: async () => {
        setConfirmModal(m => ({ ...m, isOpen: false }));
        try {
          await axios.delete(`${API}/kos/${id_kos}`, { headers });
          showNotif('Kos berhasil dihapus!');
          fetchKos();
        } catch (err) {
          showNotif('Gagal menghapus kos.', 'error');
        }
      }
    });
  };

  // ── Kamar CRUD ──
  const handleAddKamar = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/kamar`, { id_kos: selectedKosKamar.id_kos, ...kamarForm }, { headers });
      showNotif('Kamar berhasil ditambahkan!');
      setKamarForm({ nomor_kamar: '', status_kamar: 'Kosong' });
      fetchKamar(selectedKosKamar.id_kos);
    } catch (err) {
      showNotif('Gagal menambahkan kamar.', 'error');
    }
  };

  const handleUpdateKamar = async (id_kamar, status_kamar) => {
    const newStatus = status_kamar === 'Kosong' ? 'Penuh' : 'Kosong';
    try {
      await axios.put(`${API}/kamar/${id_kamar}`, { status_kamar: newStatus }, { headers });
      showNotif(`Status kamar diubah menjadi ${newStatus}!`);
      fetchKamar(selectedKosKamar.id_kos);
    } catch (err) {
      showNotif('Gagal mengubah status kamar.', 'error');
    }
  };

  const handleDeleteKamar = (id_kamar) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Kamar?',
      message: 'Yakin ingin menghapus kamar ini? Tindakan ini tidak dapat dibatalkan.',
      onConfirm: async () => {
        setConfirmModal(m => ({ ...m, isOpen: false }));
        try {
          await axios.delete(`${API}/kamar/${id_kamar}`, { headers });
          showNotif('Kamar berhasil dihapus!');
          fetchKamar(selectedKosKamar.id_kos);
        } catch (err) {
          showNotif('Gagal menghapus kamar.', 'error');
        }
      }
    });
  };

  // ── Tab helpers ──
  const openEditTab = (kos) => {
    setSelectedKos(kos);
    setKosForm({
      nama_kos: kos.nama_kos,
      alamat_kos: kos.alamat_kos,
      tipe_kos: kos.tipe_kos,
      harga_mulai_dari: kos.harga_mulai_dari,
      periode_sewa: kos.periode_sewa || 'Bulan',
      fasilitas_umum: kos.fasilitas_umum || '',
      fasilitas_kamar: kos.fasilitas_kamar || '',
      no_wa_pemilik: kos.no_wa_pemilik,
      foto: null,
    });
    setActiveTab('edit');
  };

  const openKamarTab = (kos) => {
    setSelectedKosKamar(kos);
    fetchKamar(kos.id_kos);
    setActiveTab('kamar');
  };

  if (loading) return <div className="text-center mt-8 container">Memuat dashboard...</div>;

  return (
    <div className="container animate-fade-in">
      {/* ── Confirm Modal ── */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(m => ({ ...m, isOpen: false }))}
      />
      <div className="flex justify-between items-center mb-8">
        <h1>Dashboard Pemilik</h1>
        {activeTab === 'list' && (
          <button
            id="btn-tambah-kos"
            className="btn btn-primary"
            onClick={() => { setKosForm(emptyKosForm); setActiveTab('tambah'); }}
          >
            + Tambah Kos Baru
          </button>
        )}
        {activeTab !== 'list' && (
          <button className="btn btn-outline" onClick={() => setActiveTab('list')}>
            &larr; Kembali ke Daftar
          </button>
        )}
      </div>

      {/* Notification */}
      {notif.msg && (
        <div style={{
          background: notif.type === 'error' ? '#fdf0f0' : '#f0f7f2',
          border: `1px solid ${notif.type === 'error' ? '#e8b4b4' : '#b4d4bf'}`,
          color: notif.type === 'error' ? 'var(--danger)' : 'var(--success)',
          padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
          fontSize: '0.9rem', fontWeight: '500'
        }}>
          {notif.msg}
        </div>
      )}

      {/* ---- Tab: List Kos ---- */}
      {activeTab === 'list' && (
        <>
          {kosList.length === 0 ? (
            <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Anda belum mendaftarkan kos apapun.</h3>
              <button className="btn btn-primary mt-4" onClick={() => setActiveTab('tambah')}>
                Tambah Kos Pertama Anda
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} className="glass-panel">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-light)', background: '#faf8f5' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Nama Kos</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Tipe</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Harga</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kosList.map(kos => (
                    <tr
                      key={kos.id_kos}
                      style={{ borderBottom: '1px solid var(--surface-light)', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{kos.nama_kos}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          background: kos.tipe_kos === 'Putra' ? 'rgba(107,138,163,0.2)' :
                                      kos.tipe_kos === 'Putri' ? 'rgba(176,139,130,0.2)' :
                                      'rgba(124,152,133,0.2)',
                          color: kos.tipe_kos === 'Putra' ? '#8aacbf' :
                                 kos.tipe_kos === 'Putri' ? '#c4968d' :
                                 'var(--primary)',
                          border: `1px solid ${kos.tipe_kos === 'Putra' ? '#8aacbf' : kos.tipe_kos === 'Putri' ? '#c4968d' : 'var(--primary)'}`,
                          padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600'
                        }}>
                          {kos.tipe_kos}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: '600' }}>
                        Rp {Number(kos.harga_mulai_dari).toLocaleString('id-ID')}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                          {' '}/ {kos.periode_sewa?.toLowerCase() || 'bulan'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div className="flex gap-4">
                          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => openKamarTab(kos)}>Kamar</button>
                          <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => openEditTab(kos)}>Edit</button>
                          <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleDeleteKos(kos.id_kos)}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ---- Tab: Tambah Kos ---- */}
      {activeTab === 'tambah' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="mb-8">Tambah Kos Baru</h2>
          <KosForm
            kosForm={kosForm}
            onChange={handleKosFormChange}
            onSubmit={handleAddKos}
            onCancel={() => setActiveTab('list')}
          />
        </div>
      )}

      {/* ---- Tab: Edit Kos ---- */}
      {activeTab === 'edit' && selectedKos && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="mb-8">Edit: {selectedKos.nama_kos}</h2>
          <KosForm
            kosForm={kosForm}
            onChange={handleKosFormChange}
            onSubmit={handleEditKos}
            onCancel={() => setActiveTab('list')}
            isEdit={true}
          />
        </div>
      )}

      {/* ---- Tab: Kelola Kamar ---- */}
      {activeTab === 'kamar' && selectedKosKamar && (
        <div>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 className="mb-8">Kelola Kamar: {selectedKosKamar.nama_kos}</h2>
            <form onSubmit={handleAddKamar}>
              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                  <label className="form-label">Nomor Kamar</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: A1, 101, dll"
                    value={kamarForm.nomor_kamar}
                    onChange={e => setKamarForm(prev => ({ ...prev, nomor_kamar: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '180px' }}>
                  <label className="form-label">Status Awal</label>
                  <select
                    className="form-control"
                    value={kamarForm.status_kamar}
                    onChange={e => setKamarForm(prev => ({ ...prev, status_kamar: e.target.value }))}
                  >
                    <option value="Kosong">Kosong</option>
                    <option value="Penuh">Penuh</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary">+ Tambah Kamar</button>
                </div>
              </div>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h3 className="mb-4">Daftar Kamar</h3>
            {kamarList.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                Belum ada kamar yang ditambahkan.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-light)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>No. Kamar</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kamarList.map(k => (
                    <tr key={k.id_kamar} style={{ borderBottom: '1px solid var(--surface-light)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{k.nomor_kamar}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold',
                          backgroundColor: k.status_kamar === 'Kosong' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: k.status_kamar === 'Kosong' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {k.status_kamar}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div className="flex gap-4">
                          <button
                            className={`btn ${k.status_kamar === 'Kosong' ? 'btn-danger' : 'btn-success'}`}
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => handleUpdateKamar(k.id_kamar, k.status_kamar)}
                          >
                            Tandai {k.status_kamar === 'Kosong' ? 'Penuh' : 'Kosong'}
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteKamar(k.id_kamar)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
