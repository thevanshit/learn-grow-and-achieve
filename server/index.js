import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import plannerRoutes from './routes/planner.js';
import taskRoutes from './routes/tasks.js';
import statsRoutes from './routes/stats.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'learn-grow-and-achieve' }));

app.use('/api/auth', authRoutes);
app.use('/api', plannerRoutes);
app.use('/api', taskRoutes);
app.use('/api', statsRoutes);

// Serve built client in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), err => {
    if (err) res.status(404).json({ error: 'Client not built. Run: cd client && npm run build' });
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => console.log(`🚀 Learn-Grow-and-Achieve API on http://localhost:${PORT}`));