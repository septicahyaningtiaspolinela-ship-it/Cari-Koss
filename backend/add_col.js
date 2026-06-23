const pool = require('./db');
pool.query("ALTER TABLE kos ADD COLUMN IF NOT EXISTS periode_sewa VARCHAR(20) DEFAULT 'Bulan'")
  .then(() => {
    console.log('Column added');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
