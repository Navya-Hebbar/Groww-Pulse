// ──────────────────────────────────────────────
// Groww Pulse — Health Check Routes
// ──────────────────────────────────────────────

import { Router, Request, Response } from 'express';
import { prisma } from '../../db.js';

export const healthRouter = Router();

// GET /health — basic liveness
healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// GET /ready — full readiness (DB, Redis, etc.)
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  const checks: Record<string, string> = {};

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'healthy';
  } catch {
    checks.database = 'unhealthy';
  }

  // Check Redis (will be added in Phase 10)
  checks.redis = 'not_configured';

  // Check market provider (will be added in Phase 4)
  checks.marketProvider = 'not_configured';

  const allHealthy = Object.values(checks).every(
    (v) => v === 'healthy' || v === 'not_configured'
  );

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'not_ready',
    ...checks,
    timestamp: new Date().toISOString(),
  });
});
