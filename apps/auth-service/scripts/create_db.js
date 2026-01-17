const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  try {
    const env = {};
    const envPath = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      fs.readFileSync(envPath, 'utf8')
        .split(/\r?\n/)
        .forEach((l) => {
          const m = l.match(/^([^#=]+)=(.*)$/);
          if (m) env[m[1].trim()] = m[2].trim();
        });
    }

    // Parse DATABASE_URL if available
    const databaseUrl = process.env.DATABASE_URL || env.DATABASE_URL;
    let host, port, user, password, db;
    
    if (databaseUrl) {
      const match = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
      if (match) {
        [, user, password, host, port, db] = match;
        port = parseInt(port);
        // Remove any quotes from database name
        db = db.replace(/"/g, '');
      }
    }
    
    // Fallback to individual env vars
    host = host || process.env.DB_HOST || env.DB_HOST || 'localhost';
    port = port || +(process.env.DB_PORT || env.DB_PORT || 5433);
    user = user || process.env.DB_USER || env.DB_USER || 'postgres';
    password = password || process.env.DB_PASSWORD || env.DB_PASSWORD || 'postgres';
    db = db || process.env.DB_NAME || env.DB_NAME || 'auth_service_dev';

    console.log('Connecting to Postgres at', host + ':' + port, 'as user', user);

    const client = new Client({ host, port, user, password, database: 'postgres' });
    await client.connect();

    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [db]);
    if (res.rowCount === 0) {
      console.log('Database not found, creating', db);
      await client.query(`CREATE DATABASE "${db}"`);
      console.log('Created database', db);
    } else {
      console.log('Database exists:', db);
    }

    await client.end();
    process.exit(0);
  } catch (e) {
    console.error('Connection/create DB failed:', e.message || e);
    process.exit(1);
  }
})();