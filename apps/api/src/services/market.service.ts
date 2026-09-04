import { Quote } from '@groww-pulse/shared';
import { MarketProvider } from './providers/market.provider.js';
import { MockMarketProvider } from './providers/mock.provider.js';
import { YahooFinanceProvider } from './providers/yahoo.provider.js';

class MarketService {
  private provider: MarketProvider;

  constructor() {
    const isDemo = process.env.DEMO_MODE !== 'false';
    if (isDemo) {
      console.log('📈 Starting MarketService in DEMO MODE (Mock Data)');
      this.provider = new MockMarketProvider();
    } else {
      console.log('🚀 Starting MarketService in LIVE MODE (Yahoo Finance)');
      this.provider = new YahooFinanceProvider();
    }
  }

  async getQuotes(symbols: string[]): Promise<Quote[]> {
    return this.provider.getQuotes(symbols);
  }

  async getEvents(symbols: string[]) {
    return this.provider.getEvents(symbols);
  }
}

export const marketService = new MarketService();
