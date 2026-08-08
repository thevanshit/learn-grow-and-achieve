import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ---------- Batches (with per-user progress) ----------
router.get('/batches', async (req, res) => {
  const batches = await db.prepare('SELECT * FROM batches ORDER BY id').all();
  const result = [];
  for (const b of batches) {
    const booksTotal = (await db.prepare('SELECT COUNT(*) c FROM books WHERE batch_id = ?').get(b.id)).c;
    const booksDone = (await db.prepare(`
      SELECT COUNT(*) c FROM user_books ub
      JOIN books bk ON bk.id = ub.book_id
      WHERE ub.user_id = ? AND bk.batch_id = ? AND ub.status = 'done'
    `).get(req.user.id, b.id)).c;
    const weeksTotal = (await db.prepare('SELECT COUNT(*) c FROM weeks WHERE batch_id = ?').get(b.id)).c;
    const weeksDone = (await db.prepare(`
      SELECT COUNT(*) c FROM user_weeks uw
      JOIN weeks w ON w.id = uw.week_id
      WHERE uw.user_id = ? AND w.batch_id = ? AND uw.completed = 1
    `).get(req.user.id, b.id)).c;
    const pct = weeksTotal ? Math.round((weeksDone / weeksTotal) * 100) : 0;
    result.push({ ...b, booksTotal, booksDone, weeksTotal, weeksDone, progress: pct });
  }
  res.json(result);
});

// ---------- Books (with user status) ----------
router.get('/books', async (req, res) => {
  const rows = await db.prepare(`
    SELECT bk.*, ub.status, ub.progress AS user_progress
    FROM books bk
    LEFT JOIN user_books ub ON ub.book_id = bk.id AND ub.user_id = ?
    ORDER BY bk.id
  `).all(req.user.id);
  res.json(rows.map(b => ({ ...b, status: b.status || 'todo', user_progress: b.user_progress || 0 })));
});

// Update book status/progress
router.patch('/books/:id', async (req, res) => {
  const { status, progress } = req.body || {};
  const bookId = Number(req.params.id);
  const book = await db.prepare('SELECT id, pages FROM books WHERE id = ?').get(bookId);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const existing = await db.prepare('SELECT * FROM user_books WHERE user_id = ? AND book_id = ?').get(req.user.id, bookId);
  const now = new Date().toISOString();
  const newStatus = status || existing?.status || 'todo';
  const newProgress = progress ?? existing?.progress ?? 0;
  const prevProgress = existing?.progress ?? 0;

  let startedAt = existing?.started_at ?? null;
  let finishedAt = existing?.finished_at ?? null;
  if (newStatus === 'reading' && !startedAt) startedAt = now;
  if (newStatus === 'done') { finishedAt = now; }
  if (newStatus !== 'done' && existing?.status === 'done') finishedAt = null;

  if (existing) {
    await db.prepare('UPDATE user_books SET status = ?, progress = ?, started_at = COALESCE(?, started_at), finished_at = ? WHERE user_id = ? AND book_id = ?')
      .run(newStatus, newProgress, startedAt, finishedAt, req.user.id, bookId);
  } else {
    await db.prepare('INSERT INTO user_books (user_id, book_id, status, progress, started_at, finished_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(req.user.id, bookId, newStatus, newProgress, startedAt, finishedAt);
  }

  // Reading counts toward the daily streak: log pages actually read today
  const pagesDelta = Math.round(((newProgress - prevProgress) / 100) * (book.pages || 0));
  if (pagesDelta > 0) await bumpReadingLog(req.user.id, pagesDelta);

  res.json({ id: bookId, status: newStatus, progress: newProgress });
});

// ---------- Daily reading log (feeds streaks + activity chart) ----------
async function bumpReadingLog(userId, pages) {
  const today = new Date().toISOString().slice(0, 10);
  await db.prepare(`
    INSERT INTO daily_log (user_id, date, tasks_completed, pages_read) VALUES (?, ?, 0, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET pages_read = pages_read + ?
  `).run(userId, today, pages, pages);
}

// ---------- Weeks (with user completion) ----------
router.get('/weeks', async (req, res) => {
  const rows = await db.prepare(`
    SELECT w.*, uw.completed, uw.completed_at
    FROM weeks w
    LEFT JOIN user_weeks uw ON uw.week_id = w.id AND uw.user_id = ?
    ORDER BY w.week
  `).all(req.user.id);
  res.json(rows.map(w => ({ ...w, completed: w.completed || 0 })));
});

// Toggle week completion
router.patch('/weeks/:id', async (req, res) => {
  const { completed } = req.body || {};
  const weekId = Number(req.params.id);
  const week = await db.prepare('SELECT id FROM weeks WHERE id = ?').get(weekId);
  if (!week) return res.status(404).json({ error: 'Week not found' });

  const existing = await db.prepare('SELECT * FROM user_weeks WHERE user_id = ? AND week_id = ?').get(req.user.id, weekId);
  const now = new Date().toISOString();
  if (existing) {
    await db.prepare('UPDATE user_weeks SET completed = ?, completed_at = ? WHERE user_id = ? AND week_id = ?')
      .run(completed ? 1 : 0, completed ? now : null, req.user.id, weekId);
  } else {
    await db.prepare('INSERT INTO user_weeks (user_id, week_id, completed, completed_at) VALUES (?, ?, ?, ?)')
      .run(req.user.id, weekId, completed ? 1 : 0, completed ? now : null);
  }
  res.json({ id: weekId, completed: completed ? 1 : 0 });
});

// ---------- Daily reading plan (Aug 8 2026 → Feb 1 2027, before GSoC org list) ----------
const PLAN_START = new Date('2026-08-08T00:00:00');
const PLAN_DEADLINE = new Date('2027-02-01T00:00:00');

router.get('/plan', async (req, res) => {
  const rows = await db.prepare(`
    SELECT bk.*, ub.status, ub.progress AS user_progress
    FROM books bk
    LEFT JOIN user_books ub ON ub.book_id = bk.id AND ub.user_id = ?
    ORDER BY bk.id
  `).all(req.user.id);

  const now = new Date();
  const daysRemaining = Math.max(1, Math.ceil((PLAN_DEADLINE - now) / 86400000));
  const daysElapsed = Math.max(0, Math.floor((now - PLAN_START) / 86400000));

  let totalPages = 0;
  let pagesRead = 0;
  let booksDone = 0;
  let currentBook = null;
  let currentBookPagesRead = 0;
  let currentBookProgress = 0;

  for (const b of rows) {
    const p = b.pages || 0;
    totalPages += p;
    const prog = Math.min(Math.max(b.user_progress || 0, 0), 100);
    const read = Math.round((p * prog) / 100);
    pagesRead += read;
    if (b.status === 'done') booksDone++;
    if (!currentBook && prog < 100) {
      currentBook = b;
      currentBookPagesRead = read;
      currentBookProgress = prog;
    }
  }

  const remainingPages = Math.max(0, totalPages - pagesRead);
  const pagesPerDay = Math.ceil(remainingPages / daysRemaining);

  // Pace analysis: expected vs actual, projected finish date
  const daysTotal = daysElapsed + daysRemaining;
  const expectedPages = Math.round(totalPages * (daysElapsed / daysTotal));
  const paceDiff = pagesRead - expectedPages; // + ahead, - behind
  let projectedFinishDate = null;
  if (daysElapsed > 0 && pagesRead > 0) {
    const actualPace = pagesRead / daysElapsed;
    const daysToFinish = Math.ceil(remainingPages / actualPace);
    projectedFinishDate = new Date(now.getTime() + daysToFinish * 86400000).toISOString().slice(0, 10);
  }

  // Today's assignment: current book, pages [read+1 .. read+pagesPerDay] (capped at book pages)
  let today = null;
  if (currentBook) {
    const from = currentBookPagesRead + 1;
    const to = Math.min(currentBook.pages, currentBookPagesRead + pagesPerDay);
    today = {
      book: { id: currentBook.id, title: currentBook.title, author: currentBook.author, pages: currentBook.pages, batch_id: currentBook.batch_id },
      fromPage: from,
      toPage: to,
      pagesToday: to - from + 1,
      bookProgress: Math.round(((currentBookPagesRead + (to - from + 1)) / currentBook.pages) * 100)
    };
  }

  res.json({
    startDate: '2026-08-08',
    deadline: '2027-02-01',
    daysElapsed,
    daysRemaining,
    totalPages,
    pagesRead,
    remainingPages,
    pagesPerDay,
    expectedPages,
    paceDiff,
    projectedFinishDate,
    booksTotal: rows.length,
    booksDone,
    currentBook: currentBook ? { id: currentBook.id, title: currentBook.title, author: currentBook.author, pages: currentBook.pages, batch_id: currentBook.batch_id } : null,
    currentBookProgress,
    today,
    onTrack: pagesRead >= Math.round(totalPages * (daysElapsed / (daysElapsed + daysRemaining)))
  });
});

// ---------- Milestones ----------
router.get('/milestones', async (req, res) => {
  const rows = await db.prepare(`
    SELECT m.*, um.completed, um.completed_at
    FROM milestones m
    LEFT JOIN user_milestones um ON um.milestone_id = m.id AND um.user_id = ?
    ORDER BY m.id
  `).all(req.user.id);
  res.json(rows.map(m => ({ ...m, completed: m.completed || 0 })));
});

router.patch('/milestones/:id', async (req, res) => {
  const { completed } = req.body || {};
  const mid = Number(req.params.id);
  const m = await db.prepare('SELECT id FROM milestones WHERE id = ?').get(mid);
  if (!m) return res.status(404).json({ error: 'Milestone not found' });

  const existing = await db.prepare('SELECT * FROM user_milestones WHERE user_id = ? AND milestone_id = ?').get(req.user.id, mid);
  const now = new Date().toISOString();
  if (existing) {
    await db.prepare('UPDATE user_milestones SET completed = ?, completed_at = ? WHERE user_id = ? AND milestone_id = ?')
      .run(completed ? 1 : 0, completed ? now : null, req.user.id, mid);
  } else {
    await db.prepare('INSERT INTO user_milestones (user_id, milestone_id, completed, completed_at) VALUES (?, ?, ?, ?)')
      .run(req.user.id, mid, completed ? 1 : 0, completed ? now : null);
  }
  res.json({ id: mid, completed: completed ? 1 : 0 });
});

export default router;