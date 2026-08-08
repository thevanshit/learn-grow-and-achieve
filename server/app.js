import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import authRoutes from './routes/auth.js';
import plannerRoutes from './routes/planner.js';
import taskRoutes from './routes/tasks.js';
import statsRoutes from './routes/stats.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Idempotent schema migrations (adds pages_read to daily_log etc.).
// Runs on every cold start so remote (Turso) DBs stay in sync with code.
await db.migrate().catch(err => console.error('Migration failed:', err.message));

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'learn-grow-and-achieve' }));

app.use('/api/auth', authRoutes);
app.use('/api', plannerRoutes);
app.use('/api', taskRoutes);
app.use('/api', statsRoutes);

// Serve built client in production (local mode only — on Vercel,
// static files and SPA rewrites are handled by Vercel itself)
if (!process.env.VERCEL) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'), err => {
      if (err) res.status(404).json({ error: 'Client not built. Run: cd client && npm run build' });
    });
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

export default app;