import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, 'planner.db'));

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// ---------- Schema ----------
db.exec(`
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

  -- Per-user progress
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
`);

// ---------- Lightweight migrations ----------
// Add notes.title if the table predates it
const notesCols = db.prepare("PRAGMA table_info(notes)").all();
if (!notesCols.some(c => c.name === 'title')) {
  db.exec('ALTER TABLE notes ADD COLUMN title TEXT');
}

export default db;