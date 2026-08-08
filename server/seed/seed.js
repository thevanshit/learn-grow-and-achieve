import db from '../db.js';
import { batches } from './batches.js';
import { books } from './books.js';
import { weeks } from './weeks.js';
import { milestones } from './milestones.js';

async function main() {
  // Ensure schema exists (no-op locally, creates tables on remote/Turso)
  await db.setupSchema();
  await db.migrate();

  // Reset content tables (keep users + progress)
  await db.exec(`
    DELETE FROM user_books;
    DELETE FROM user_weeks;
    DELETE FROM user_milestones;
    DELETE FROM custom_tasks;
    DELETE FROM daily_log;
    DELETE FROM notes;
    DELETE FROM milestones;
    DELETE FROM weeks;
    DELETE FROM books;
    DELETE FROM batches;
  `);

  const insertBatch = db.prepare('INSERT INTO batches (id, title, focus, calendar, weeks, color, icon) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const insertBook = db.prepare('INSERT INTO books (id, batch_id, title, author, publisher, year, covers, pages) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertWeek = db.prepare('INSERT INTO weeks (id, batch_id, week, title, read, do) VALUES (?, ?, ?, ?, ?, ?)');
  const insertMilestone = db.prepare('INSERT INTO milestones (id, title, description, books, week) VALUES (?, ?, ?, ?, ?)');

  for (const b of batches) await insertBatch.run(b.id, b.title, b.focus, b.calendar, b.weeks, b.color, b.icon);
  for (const b of books) await insertBook.run(b.id, b.batch_id, b.title, b.author, b.publisher, b.year, b.covers, b.pages || 0);
  for (const w of weeks) await insertWeek.run(w.id, w.batch_id, w.week, w.title, w.read, w.do);
  for (const m of milestones) await insertMilestone.run(m.id, m.title, m.description, m.books, m.week);

  console.log(`Seeded: ${batches.length} batches, ${books.length} books, ${weeks.length} weeks, ${milestones.length} milestones`);
  console.log(db.isRemote ? 'Database: remote (Turso)' : 'Database: local (planner.db)');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});