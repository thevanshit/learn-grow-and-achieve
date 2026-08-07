import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ---------- Batches (with per-user progress) ----------
router.get('/batches', (req, res) => {
  const batches = db.prepare('SELECT * FROM batches ORDER BY id').all();
  const result = batches.map(b => {
    const booksTotal = db.prepare('SELECT COUNT(*) c FROM books WHERE batch_id = ?').get(b.id).c;
    const booksDone = db.prepare(`
      SELECT COUNT(*) c FROM user_books ub
      JOIN books bk ON bk.id = ub.book_id
      WHERE ub.user_id = ? AND bk.batch_id = ? AND ub.status = 'done'
    `).get(req.user.id, b.id).c;
    const weeksTotal = db.prepare('SELECT COUNT(*) c FROM weeks WHERE batch_id = ?').get(b.id).c;
    const weeksDone = db.prepare(`
      SELECT COUNT(*) c FROM user_weeks uw
      JOIN weeks w ON w.id = uw.week_id
      WHERE uw.user_id = ? AND w.batch_id = ? AND uw.completed = 1
    `).get(req.user.id, b.id).c;
    const pct = weeksTotal ? Math.round((weeksDone / weeksTotal) * 100) : 0;
    return { ...b, booksTotal, booksDone, weeksTotal, weeksDone, progress: pct };
  });
  res.json(result);
});

// ---------- Books (with user status) ----------
router.get('/books', (req, res) => {
  const rows = db.prepare(`
    SELECT bk.*, ub.status, ub.progress AS user_progress
    FROM books bk
    LEFT JOIN user_books ub ON ub.book_id = bk.id AND ub.user_id = ?
    ORDER BY bk.id
  `).all(req.user.id);
  res.json(rows.map(b => ({ ...b, status: b.status || 'todo', user_progress: b.user_progress || 0 })));
});

// Update book status/progress
router.patch('/books/:id', (req, res) => {
  const { status, progress } = req.body || {};
  const bookId = Number(req.params.id);
  const book = db.prepare('SELECT id FROM books WHERE id = ?').get(bookId);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const existing = db.prepare('SELECT * FROM user_books WHERE user_id = ? AND book_id = ?').get(req.user.id, bookId);
  const now = new Date().toISOString();
  const newStatus = status || existing?.status || 'todo';
  const newProgress = progress ?? existing?.progress ?? 0;

  let startedAt = existing?.started_at ?? null;
  let finishedAt = existing?.finished_at ?? null;
  if (newStatus === 'reading' && !startedAt) startedAt = now;
  if (newStatus === 'done') { finishedAt = now; }
  if (newStatus !== 'done' && existing?.status === 'done') finishedAt = null;

  if (existing) {
    db.prepare('UPDATE user_books SET status = ?, progress = ?, started_at = COALESCE(?, started_at), finished_at = ? WHERE user_id = ? AND book_id = ?')
      .run(newStatus, newProgress, startedAt, finishedAt, req.user.id, bookId);
  } else {
    db.prepare('INSERT INTO user_books (user_id, book_id, status, progress, started_at, finished_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(req.user.id, bookId, newStatus, newProgress, startedAt, finishedAt);
  }
  res.json({ id: bookId, status: newStatus, progress: newProgress });
});

// ---------- Weeks (with user completion) ----------
router.get('/weeks', (req, res) => {
  const rows = db.prepare(`
    SELECT w.*, uw.completed, uw.completed_at
    FROM weeks w
    LEFT JOIN user_weeks uw ON uw.week_id = w.id AND uw.user_id = ?
    ORDER BY w.week
  `).all(req.user.id);
  res.json(rows.map(w => ({ ...w, completed: w.completed || 0 })));
});

// Toggle week completion
router.patch('/weeks/:id', (req, res) => {
  const { completed } = req.body || {};
  const weekId = Number(req.params.id);
  const week = db.prepare('SELECT id FROM weeks WHERE id = ?').get(weekId);
  if (!week) return res.status(404).json({ error: 'Week not found' });

  const existing = db.prepare('SELECT * FROM user_weeks WHERE user_id = ? AND week_id = ?').get(req.user.id, weekId);
  const now = new Date().toISOString();
  if (existing) {
    db.prepare('UPDATE user_weeks SET completed = ?, completed_at = ? WHERE user_id = ? AND week_id = ?')
      .run(completed ? 1 : 0, completed ? now : null, req.user.id, weekId);
  } else {
    db.prepare('INSERT INTO user_weeks (user_id, week_id, completed, completed_at) VALUES (?, ?, ?, ?)')
      .run(req.user.id, weekId, completed ? 1 : 0, completed ? now : null);
  }
  res.json({ id: weekId, completed: completed ? 1 : 0 });
});

// ---------- Milestones ----------
router.get('/milestones', (req, res) => {
  const rows = db.prepare(`
    SELECT m.*, um.completed, um.completed_at
    FROM milestones m
    LEFT JOIN user_milestones um ON um.milestone_id = m.id AND um.user_id = ?
    ORDER BY m.id
  `).all(req.user.id);
  res.json(rows.map(m => ({ ...m, completed: m.completed || 0 })));
});

router.patch('/milestones/:id', (req, res) => {
  const { completed } = req.body || {};
  const mid = Number(req.params.id);
  const m = db.prepare('SELECT id FROM milestones WHERE id = ?').get(mid);
  if (!m) return res.status(404).json({ error: 'Milestone not found' });

  const existing = db.prepare('SELECT * FROM user_milestones WHERE user_id = ? AND milestone_id = ?').get(req.user.id, mid);
  const now = new Date().toISOString();
  if (existing) {
    db.prepare('UPDATE user_milestones SET completed = ?, completed_at = ? WHERE user_id = ? AND milestone_id = ?')
      .run(completed ? 1 : 0, completed ? now : null, req.user.id, mid);
  } else {
    db.prepare('INSERT INTO user_milestones (user_id, milestone_id, completed, completed_at) VALUES (?, ?, ?, ?)')
      .run(req.user.id, mid, completed ? 1 : 0, completed ? now : null);
  }
  res.json({ id: mid, completed: completed ? 1 : 0 });
});

export default router;