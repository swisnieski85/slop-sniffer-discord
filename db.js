// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guild_configs (
      guild_id      TEXT PRIMARY KEY,
      channel_id    TEXT NOT NULL,
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getConfig(guildId) {
  const result = await pool.query(
    'SELECT channel_id FROM guild_configs WHERE guild_id = $1',
    [guildId]
  );
  return result.rows[0] || null;
}

async function setConfig(guildId, channelId) {
  await pool.query(`
    INSERT INTO guild_configs (guild_id, channel_id, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (guild_id) DO UPDATE SET channel_id = $2, updated_at = NOW()
  `, [guildId, channelId]);
}

async function deleteConfig(guildId) {
  const result = await pool.query(
    'DELETE FROM guild_configs WHERE guild_id = $1',
    [guildId]
  );
  return result.rowCount > 0;
}

module.exports = { init, getConfig, setConfig, deleteConfig };
