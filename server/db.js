import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Remote mode: use hosted SQLite (Turso/libSQL) on Vercel or when TURSO_DATABASE_URL is set.
// Local mode: Node's built-in node:sqlite with a file on disk.
const isRemote = !!process.env.TURSO_DATABASE_URL || process.env.VERCEL === '1';

if (isRemote && !process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL must be set (and TURSO_AUTH_TOKEN for a token-authed DB)');
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS batches (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    focus TEXT,
    calendar TEXT,
    weeks TEXT,
    color TEXT,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES batches(id),
    title TEXT NOT NULL,
    author TEXT,
    publisher TEXT,
    year INTEGER,
    covers TEXT
  );

  CREATE TABLE IF NOT EXISTS weeks (
    id INTEGER PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES batches(id),
    week INTEGER NOT NULL,
    title TEXT NOT NULL,
    read TEXT,
    do TEXT
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    books TEXT,
    week INTEGER
  );

  CREATE TABLE IF NOT EXISTS user_books (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'todo',
    progress INTEGER DEFAULT 0,
    started_at TEXT,
    finished_at TEXT,
    PRIMARY KEY (user_id, book_id)
  );

  CREATE TABLE IF NOT EXISTS user_weeks (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    PRIMARY KEY (user_id, week_id)
  );

  CREATE TABLE IF NOT EXISTS user_milestones (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    milestone_id INTEGER NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    PRIMARY KEY (user_id, milestone_id)
  );

  CREATE TABLE IF NOT EXISTS custom_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    due_date TEXT,
    priority TEXT DEFAULT 'medium',
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS daily_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    UNIQUE (user_id, date)
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

// ---------- Adapter ----------
let impl;

if (isRemote) {
  const { createClient } = await import('@libsql/client');
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });

  impl = {
    prepare(sql) {
      return {
        get: async (...args) => (await client.execute({ sql, args })).rows[0] ?? null,
        all: async (...args) => (await client.execute({ sql, args })).rows,
        run: async (...args) => {
          const r = await client.execute({ sql, args });
          return { lastInsertRowid: Number(r.lastInsertRowid), changes: Number(r.rowsAffected) };
        },
      };
    },
    exec: async (sql) => { await client.executeMultiple(sql); },
    setupSchema: async () => { await client.executeMultiple(SCHEMA); },
    // Lightweight migration: notes.title
    migrate: async () => {
      const cols = (await client.execute({ sql: 'PRAGMA table_info(notes)' })).rows;
      if (!cols.some(c => c.name === 'title')) {
        await client.execute({ sql: 'ALTER TABLE notes ADD COLUMN title TEXT' });
      }
    },
  };
} else {
  const raw = new DatabaseSync(path.join(__dirname, 'planner.db'));
  raw.exec('PRAGMA journal_mode = WAL');
  raw.exec('PRAGMA foreign_keys = ON');
  raw.exec(SCHEMA);

  // Migration: add notes.title if the table predates it
  const notesCols = raw.prepare('PRAGMA table_info(notes)').all();
  if (!notesCols.some(c => c.name === 'title')) {
    raw.exec('ALTER TABLE notes ADD COLUMN title TEXT');
  }

  impl = {
    prepare(sql) {
      const stmt = raw.prepare(sql);
      return {
        get: (...args) => stmt.get(...args) ?? null,
        all: (...args) => stmt.all(...args),
        run: (...args) => {
          const info = stmt.run(...args);
          return { lastInsertRowid: Number(info.lastInsertRowid), changes: Number(info.changes) };
        },
      };
    },
    exec: (sql) => { raw.exec(sql); },
    setupSchema: () => { raw.exec(SCHEMA); },
    migrate: () => {},
  };
}

// Unified facade: local methods are sync, remote are async —
// `await` works for both.
const db = {
  prepare: (sql) => impl.prepare(sql),
  exec: (sql) => impl.exec(sql),
  setupSchema: () => impl.setupSchema(),
  migrate: () => impl.migrate(),
  isRemote,
};

export default db;