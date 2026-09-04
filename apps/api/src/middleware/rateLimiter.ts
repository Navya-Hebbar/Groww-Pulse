// ──────────────────────────────────────────────
// Groww Pulse — Rate Limiter
// ──────────────────────────────────────────────

import rateLimit from 'express-rate-limit';
import { API_CONFIG } from '@groww-pulse/shared';

export const rateLimiter = rateLimit({
  windowMs: API_CONFIG.rateLimitWindow,
  max: API_CONFIG.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
});
