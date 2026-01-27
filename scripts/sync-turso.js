const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.DATABASE_URL || 'libsql://healthyornot-sidnarasimhan.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk1MDQ0NzcsImlkIjoiYjA1MzIxMjQtNjllZC00YjI4LWJkNDktYjRkY2E2MGQ2NmJlIiwicmlkIjoiNmU5NTUwMmEtNzhiNC00Yjc4LWEyNTQtOTg2YjI0OTE5OTkwIn0.OYqY7InD7A0R02bC14U3reHbMcu1BaLtbJ5HZ9V7XLB0NLNpqMItLfBZHFkmzL5Iynte_e3s3_FFeRwc68LxBA',
});

const schema = `
-- Account table
CREATE TABLE IF NOT EXISTS Account (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerAccountId TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, providerAccountId),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Session table
CREATE TABLE IF NOT EXISTS Session (
  id TEXT PRIMARY KEY,
  sessionToken TEXT NOT NULL UNIQUE,
  userId TEXT NOT NULL,
  expires TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- User table
CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  emailVerified TEXT,
  image TEXT,
  stripeCustomerId TEXT,
  subscriptionId TEXT,
  subscriptionStatus TEXT,
  planType TEXT DEFAULT 'free',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- VerificationToken table
CREATE TABLE IF NOT EXISTS VerificationToken (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TEXT NOT NULL,
  UNIQUE(identifier, token)
);

-- Scan table
CREATE TABLE IF NOT EXISTS Scan (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  healthScore INTEGER NOT NULL,
  analysis TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  pros TEXT NOT NULL,
  cons TEXT NOT NULL,
  imageUrl TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- ApiKey table
CREATE TABLE IF NOT EXISTS ApiKey (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  userId TEXT,
  usageCount INTEGER DEFAULT 0,
  rateLimit INTEGER DEFAULT 100,
  isActive INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUsed TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS Account_userId_idx ON Account(userId);
CREATE INDEX IF NOT EXISTS Session_userId_idx ON Session(userId);
CREATE INDEX IF NOT EXISTS Scan_userId_idx ON Scan(userId);
`;

async function syncSchema() {
  console.log('Syncing schema to Turso...');

  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log('✓ Executed:', stmt.substring(0, 50) + '...');
    } catch (err) {
      // Ignore "already exists" errors
      if (!err.message.includes('already exists')) {
        console.error('Error:', err.message);
      }
    }
  }

  console.log('\n✅ Schema synced to Turso!');

  // Verify tables
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('\nTables in Turso:');
  tables.rows.forEach(row => console.log('  -', row.name));
}

syncSchema().catch(console.error);
