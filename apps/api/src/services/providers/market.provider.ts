import { Quote } from '@groww-pulse/shared';

export interface MarketEvent {
  symbol: string;
  type: string;
  title: string;
  timestamp: Date;
}

export interface MarketProvider {
  /**
   * Fetch current quotes for a list of symbols
   */
  getQuotes(symbols: string[]): Promise<Quote[]>;

  /**
   * Fetch recent events for a list of symbols
   */
  getEvents(symbols: string[]): Promise<MarketEvent[]>;
}
