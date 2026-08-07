import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ---------- Custom tasks ----------
router.get('/tasks', (req, res) => {
  const { date } = req.query;
  let rows;
  if (date) {
    rows = db.prepare('SELECT * FROM custom_tasks WHERE user_id = ? AND due_date = ? ORDER BY CASE priority WHEN \'high\' THEN 0 WHEN \'medium\' THEN 1 ELSE 2 END, id DESC').all(req.user.id, date);
  } else {
    rows = db.prepare('SELECT * FROM custom_tasks WHERE user_id = ? ORDER BY due_date ASC, CASE priority WHEN \'high\' THEN 0 WHEN \'medium\' THEN 1 ELSE 2 END, id DESC').all(req.user.id);
  }
  res.json(rows);
});

router.post('/tasks', (req, res) => {
  const { title, notes, due_date, priority } = req.body || {};
  if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });
  const info = db.prepare('INSERT INTO custom_tasks (user_id, title, notes, due_date, priority) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, title.trim(), notes || null, due_date || null, priority || 'medium');
  const task = db.prepare('SELECT * FROM custom_tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(task);
});

router.patch('/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM custom_tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { title, notes, due_date, priority, completed } = req.body || {};
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE custom_tasks SET
      title = COALESCE(?, title),
      notes = COALESCE(?, notes),
      due_date = COALESCE(?, due_date),
      priority = COALESCE(?, priority),
      completed = COALESCE(?, completed),
      completed_at = CASE WHEN ? = 1 AND completed = 0 THEN ? ELSE completed_at END
    WHERE id = ? AND user_id = ?
  `).run(
    title ?? null, notes ?? null, due_date ?? null, priority ?? null,
    completed ?? task.completed, completed ?? task.completed, now, task.id, req.user.id
  );

  const updated = db.prepare('SELECT * FROM custom_tasks WHERE id = ?').get(task.id);
  if (completed === 1 && task.completed === 0) bumpDailyLog(req.user.id);
  res.json(updated);
});

router.delete('/tasks/:id', (req, res) => {
  const info = db.prepare('DELETE FROM custom_tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Task not found' });
  res.json({ ok: true });
});

// ---------- Daily log / streaks ----------
function bumpDailyLog(userId) {
  const today = new Date().toISOString().slice(0, 10);
  db.prepare(`
    INSERT INTO daily_log (user_id, date, tasks_completed) VALUES (?, ?, 1)
    ON CONFLICT(user_id, date) DO UPDATE SET tasks_completed = tasks_completed + 1
  `).run(userId, today);
}

router.get('/daily', (req, res) => {
  const rows = db.prepare('SELECT * FROM daily_log WHERE user_id = ? ORDER BY date DESC LIMIT 30').all(req.user.id);
  res.json(rows);
});

// ---------- Notes ----------
router.get('/notes', (req, res) => {
  res.json(db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY id DESC').all(req.user.id));
});

router.post('/notes', (req, res) => {
  const { title, content } = req.body || {};
  if (!content?.trim()) return res.status(400).json({ error: 'Content is required' });
  const info = db.prepare('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)').run(req.user.id, title?.trim() || null, content.trim());
  res.status(201).json(db.prepare('SELECT * FROM notes WHERE id = ?').get(info.lastInsertRowid));
});

router.delete('/notes/:id', (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ ok: true });
});

export default router;