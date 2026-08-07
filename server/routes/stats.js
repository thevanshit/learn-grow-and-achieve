import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Overall progress + streak + GSoC countdown
router.get('/stats', async (req, res) => {
  const uid = req.user.id;

  const booksTotal = (await db.prepare('SELECT COUNT(*) c FROM books').get()).c;
  const booksDone = (await db.prepare('SELECT COUNT(*) c FROM user_books WHERE user_id = ? AND status = \'done\'').get(uid)).c;
  const booksReading = (await db.prepare('SELECT COUNT(*) c FROM user_books WHERE user_id = ? AND status = \'reading\'').get(uid)).c;

  const weeksTotal = (await db.prepare('SELECT COUNT(*) c FROM weeks').get()).c;
  const weeksDone = (await db.prepare('SELECT COUNT(*) c FROM user_weeks WHERE user_id = ? AND completed = 1').get(uid)).c;

  const milestonesTotal = (await db.prepare('SELECT COUNT(*) c FROM milestones').get()).c;
  const milestonesDone = (await db.prepare('SELECT COUNT(*) c FROM user_milestones WHERE user_id = ? AND completed = 1').get(uid)).c;

  const tasksTotal = (await db.prepare('SELECT COUNT(*) c FROM custom_tasks WHERE user_id = ?').get(uid)).c;
  const tasksDone = (await db.prepare('SELECT COUNT(*) c FROM custom_tasks WHERE user_id = ? AND completed = 1').get(uid)).c;
  const tasksToday = (await db.prepare('SELECT COUNT(*) c FROM custom_tasks WHERE user_id = ? AND due_date = ?').get(uid, today())).c;
  const tasksTodayDone = (await db.prepare('SELECT COUNT(*) c FROM custom_tasks WHERE user_id = ? AND due_date = ? AND completed = 1').get(uid, today())).c;

  // Current week (based on roadmap start: 2026-08-03)
  const currentWeek = getCurrentWeek();

  // Streak: consecutive days (daily_log or task completion)
  const streak = await computeStreak(uid);

  res.json({
    booksTotal, booksDone, booksReading,
    weeksTotal, weeksDone,
    milestonesTotal, milestonesDone,
    tasksTotal, tasksDone, tasksToday, tasksTodayDone,
    currentWeek,
    streak,
    gsoc: gsocCountdown()
  });
});

function today() { return new Date().toISOString().slice(0, 10); }

// Roadmap starts Mon 2026-08-03 (week 1). 40 weeks => ends ~2027-05-09.
function getCurrentWeek() {
  const start = new Date('2026-08-03T00:00:00');
  const now = new Date();
  const days = Math.floor((now - start) / 86400000);
  const week = Math.floor(days / 7) + 1;
  return Math.min(Math.max(week, 1), 41); // clamp; 41 = beyond plan
}

async function computeStreak(uid) {
  const rows = await db.prepare('SELECT date FROM daily_log WHERE user_id = ? ORDER BY date DESC').all(uid);
  const done = new Set(rows.map(r => r.date));
  let streak = 0;
  const d = new Date();
  // If today not yet completed, start from yesterday (grace)
  if (!done.has(toKey(d))) d.setDate(d.getDate() - 1);
  while (done.has(toKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function toKey(d) {
  return d.toISOString().slice(0, 10);
}

function gsocCountdown() {
  const targets = [
    { key: 'org_list', label: 'GSoC Org List', date: '2027-02-08' },
    { key: 'proposal', label: 'Proposal Deadline', date: '2027-03-20' },
    { key: 'results', label: 'Results', date: '2027-04-30' },
    { key: 'coding', label: 'Coding Period', date: '2027-05-17' }
  ];
  const now = Date.now();
  return targets.map(t => {
    const days = Math.max(0, Math.ceil((new Date(t.date) - now) / 86400000));
    return { ...t, daysLeft: days, passed: days === 0 && new Date(t.date) < now };
  });
}

export default router;