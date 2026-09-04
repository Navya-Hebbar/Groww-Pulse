// ──────────────────────────────────────────────
// Groww Pulse — Shared Types
// ──────────────────────────────────────────────

// ── Attention Levels ──

export type AttentionLevel = 'NORMAL' | 'WORTH_WATCHING' | 'HIGH' | 'CRITICAL';
export const AttentionLevel = {
  NORMAL: 'NORMAL' as const,
  WORTH_WATCHING: 'WORTH_WATCHING' as const,
  HIGH: 'HIGH' as const,
  CRITICAL: 'CRITICAL' as const,
};

// ── Freshness States ──

export type FreshnessState = 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE';
export const FreshnessState = {
  FRESH: 'FRESH' as const,
  DELAYED: 'DELAYED' as const,
  STALE: 'STALE' as const,
  UNAVAILABLE: 'UNAVAILABLE' as const,
};

// ── Change Event Types ──

export type EventType =
  | 'PRICE_MOVE'
  | 'VOLUME_ANOMALY'
  | '52W_HIGH'
  | '52W_LOW'
  | 'CORPORATE_EVENT'
  | 'NEWS_EVENT'
  | 'VOLATILITY_ANOMALY';

export const EventType = {
  PRICE_MOVE: 'PRICE_MOVE' as const,
  VOLUME_ANOMALY: 'VOLUME_ANOMALY' as const,
  WEEK_52_HIGH: '52W_HIGH' as const,
  WEEK_52_LOW: '52W_LOW' as const,
  CORPORATE_EVENT: 'CORPORATE_EVENT' as const,
  NEWS_EVENT: 'NEWS_EVENT' as const,
  VOLATILITY_ANOMALY: 'VOLATILITY_ANOMALY' as const,
};

// ── Severity ──

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export const Severity = {
  LOW: 'LOW' as const,
  MEDIUM: 'MEDIUM' as const,
  HIGH: 'HIGH' as const,
  CRITICAL: 'CRITICAL' as const,
};

// ── Alert Condition Types ──

export type AlertConditionType =
  | 'PRICE_ABOVE'
  | 'PRICE_BELOW'
  | 'PRICE_CHANGE_PERCENT'
  | 'ATTENTION_SCORE_ABOVE';

export const AlertConditionType = {
  PRICE_ABOVE: 'PRICE_ABOVE' as const,
  PRICE_BELOW: 'PRICE_BELOW' as const,
  PRICE_CHANGE_PERCENT: 'PRICE_CHANGE_PERCENT' as const,
  ATTENTION_SCORE_ABOVE: 'ATTENTION_SCORE_ABOVE' as const,
};

// ── Market Data ──

export interface Quote {
  symbol: string;
  price: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  week52High: number;
  week52Low: number;
  previousClose: number;
  open: number;
  timestamp: Date;
  source: string;
}

export interface HistoricalDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  sector?: string;
}

// ── Attention Score ──

export interface AttentionScoreBreakdown {
  component: string;
  points: number;
  reason: string;
}

export interface AttentionScoreResult {
  score: number;
  level: AttentionLevel;
  reasons: string[];
  breakdown: AttentionScoreBreakdown[];
}

// ── Change Detection ──

export interface DetectedChangeResult {
  eventType: EventType;
  severity: Severity;
  value: number;
  metadata: Record<string, unknown>;
}

// ── Dashboard ──

export interface DashboardSummary {
  totalStocks: number;
  needAttention: number;
  worthWatching: number;
  noMeaningfulChange: number;
  lastCheckedAt: Date | null;
}

export interface AttentionFeedItem {
  stockId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  attentionScore: AttentionScoreResult;
  changes: DetectedChangeResult[];
  lastSeenPrice: number | null;
  lastSeenAt: Date | null;
  freshness: FreshnessState;
  goalLinked: boolean;
  goalNames: string[];
}

// ── API Response ──

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
