// ──────────────────────────────────────────────
// Groww Pulse — Express Application
// ──────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Route imports
import { authRouter } from './modules/auth/auth.routes.js';
import { watchlistRouter } from './modules/watchlists/watchlists.routes.js';
import { stockRouter } from './modules/stocks/stocks.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';
import { changesRouter } from './modules/changes/changes.routes.js';
import { goalsRouter } from './modules/goals/goals.routes.js';
import { preferencesRouter } from './modules/preferences/preferences.routes.js';
import { alertsRouter } from './modules/alerts/alerts.routes.js';
import { healthRouter } from './modules/health/health.routes.js';

const app = express();

// ── Request ID middleware ──
app.use((req, _res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
  next();
});

// ── Security ──
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Parsing ──
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Compression ──
app.use(compression());

// ── Logging ──
app.use(morgan(':method :url :status :response-time ms - :req[x-request-id]'));

// ── Rate limiting ──
app.use('/api', rateLimiter);

// ── Routes ──
app.use('/api/auth', authRouter);
app.use('/api/watchlists', watchlistRouter);
app.use('/api/stocks', stockRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/changes', changesRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/', healthRouter);

// ── Error handling (must be last) ──
app.use(errorHandler);

export { app };
