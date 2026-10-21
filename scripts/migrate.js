
async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Set DATABASE_URL before running database migrations.');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const migrationDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationDir).filter((file) => file.endsWith('.sql')).sort();

  for (const filename of files) {
    const existing = await pool.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [filename]);
    if (existing.rowCount) {
      console.log(`Already applied: ${filename}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationDir, filename), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
      await client.query('COMMIT');
      console.log(`Applied: ${filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

migrate()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
