const Footer = () => {
  return (
    <footer style={{ marginTop: 'auto', padding: '2rem 0', borderTop: '1px solid var(--surface-light)', backgroundColor: 'var(--surface)', textAlign: 'center' }}>
      <div className="container">
        <p style={{ color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} CariKos. Portal Pencarian Kos Sekitar Kampus.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
