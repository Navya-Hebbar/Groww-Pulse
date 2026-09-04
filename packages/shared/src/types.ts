// ──────────────────────────────────────────────
// Groww Pulse — Shared Types
// ──────────────────────────────────────────────

// ── Attention Levels ──

export enum AttentionLevel {
  NORMAL = 'NORMAL',
  WORTH_WATCHING = 'WORTH_WATCHING',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// ── Freshness States ──

export enum FreshnessState {
  FRESH = 'FRESH',
  DELAYED = 'DELAYED',
  STALE = 'STALE',
  UNAVAILABLE = 'UNAVAILABLE',
}

// ── Change Event Types ──

export enum EventType {
  PRICE_MOVE = 'PRICE_MOVE',
  VOLUME_ANOMALY = 'VOLUME_ANOMALY',
  WEEK_52_HIGH = '52W_HIGH',
  WEEK_52_LOW = '52W_LOW',
  CORPORATE_EVENT = 'CORPORATE_EVENT',
  NEWS_EVENT = 'NEWS_EVENT',
  VOLATILITY_ANOMALY = 'VOLATILITY_ANOMALY',
}

// ── Severity ──

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// ── Alert Condition Types ──

export enum AlertConditionType {
  PRICE_ABOVE = 'PRICE_ABOVE',
  PRICE_BELOW = 'PRICE_BELOW',
  PRICE_CHANGE_PERCENT = 'PRICE_CHANGE_PERCENT',
  ATTENTION_SCORE_ABOVE = 'ATTENTION_SCORE_ABOVE',
}

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
