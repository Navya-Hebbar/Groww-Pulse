// ──────────────────────────────────────────────
// Groww Pulse — Attention Score Configuration
// ──────────────────────────────────────────────
// All attention scoring weights in ONE place.
// Do not scatter magic numbers throughout the codebase.
// ──────────────────────────────────────────────

export const ATTENTION_WEIGHTS = {
  /** Price movement contribution (0–30) */
  priceMovement: {
    maxPoints: 30,
    thresholds: {
      minor: 1,    // 1% movement
      moderate: 3, // 3% movement
      major: 5,    // 5% movement
      extreme: 10, // 10% movement
    },
  },

  /** Statistical price anomaly via z-score (0–20) */
  priceAnomaly: {
    maxPoints: 20,
    thresholds: {
      unusual: 2,       // |z| >= 2
      highlyUnusual: 3, // |z| >= 3
    },
  },

  /** Volume anomaly via ratio (0–20) */
  volumeAnomaly: {
    maxPoints: 20,
    thresholds: {
      elevated: 1.5,    // 1.5× average
      significant: 2.0, // 2.0× average
      extreme: 3.0,     // 3.0× average
    },
  },

  /** 52-week high/low events (0–15) */
  week52Event: {
    maxPoints: 15,
    nearThresholdPercent: 2, // within 2% of 52W high/low
  },

  /** Corporate/news events (0–10) */
  corporateEvent: {
    maxPoints: 10,
  },

  /** Personal relevance — goal-linked stocks (0–5) */
  personalRelevance: {
    maxPoints: 5,
  },
} as const;

// ── Attention Level Boundaries ──

export const ATTENTION_LEVELS = {
  NORMAL: { min: 0, max: 30 },
  WORTH_WATCHING: { min: 31, max: 60 },
  HIGH: { min: 61, max: 80 },
  CRITICAL: { min: 81, max: 100 },
} as const;

// ── Freshness Thresholds (in seconds) ──

export const FRESHNESS_THRESHOLDS = {
  FRESH: 60,       // < 1 minute
  DELAYED: 300,    // 1–5 minutes
  STALE: 900,      // 5–15 minutes
  // > 15 minutes = UNAVAILABLE
} as const;

// ── Market Data Config ──

export const MARKET_CONFIG = {
  /** Redis cache TTL for quotes (seconds) */
  quoteCacheTTL: 30,

  /** Background refresh interval (seconds) */
  refreshInterval: 60,

  /** Max retry attempts for market API */
  maxRetries: 3,

  /** Base delay for exponential backoff (ms) */
  retryBaseDelay: 1000,

  /** Historical data points for anomaly detection */
  historicalDataPoints: 30,
} as const;

// ── API Config ──

export const API_CONFIG = {
  /** Default page size for pagination */
  defaultPageSize: 20,

  /** Max page size */
  maxPageSize: 100,

  /** Rate limit: requests per window */
  rateLimitMax: 100,

  /** Rate limit window (ms) */
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes

  /** JWT expiry */
  jwtExpiry: '7d',
} as const;
