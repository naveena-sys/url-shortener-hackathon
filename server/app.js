import express    from 'express';
import cors       from 'cors';
import 'dotenv/config';

import authRoutes     from './src/routes/authRoutes.js';
import urlRoutes      from './src/routes/urlRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import redirectRoutes from './src/routes/redirectRoutes.js';
import errorHandler   from './src/middleware/errorHandler.js';

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.status(200).json({ success: true, message: 'Server is running.' })
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/urls',      urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Public short-code redirect (must be after /api routes) ───────────────────
app.use('/', redirectRoutes);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'API endpoint not found.'
    });
  }

  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

// ── Global error handler (must be last middleware) ───────────────────────────
app.use(errorHandler);

export default app;