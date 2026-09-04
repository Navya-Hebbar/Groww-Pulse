import { Quote } from '@groww-pulse/shared';
import { MarketProvider, MarketEvent } from './market.provider.js';

export class MockMarketProvider implements MarketProvider {
  private basePrices: Record<string, number> = {
    'RELIANCE': 2800,
    'TCS': 3900,
    'INFY': 1550,
    'HDFCBANK': 1700,
    'WIPRO': 480,
    'ICICIBANK': 1150,
    'SBIN': 800,
    'BHARTIARTL': 1580,
    'ITC': 450,
    'KOTAKBANK': 1850,
    'LT': 3600,
    'HINDUNILVR': 2500,
  };

  async getQuotes(symbols: string[]): Promise<Quote[]> {
    const now = new Date();
    
    return symbols.map((symbol) => {
      const basePrice = this.basePrices[symbol] || 1000;
      const changePercent = (Math.random() - 0.5) * 3; 
      const price = basePrice * (1 + changePercent / 100);
      const previousClose = basePrice;
      const volume = Math.random() > 0.9 ? 5000000 : 1000000;

      return {
        symbol,
        price: Number(price.toFixed(2)),
        volume,
        dayHigh: Number((price * 1.01).toFixed(2)),
        dayLow: Number((price * 0.99).toFixed(2)),
        week52High: Number((price * 1.2).toFixed(2)),
        week52Low: Number((price * 0.8).toFixed(2)),
        previousClose,
        open: previousClose,
        timestamp: now,
        source: 'mock',
      };
    });
  }

  async getEvents(symbols: string[]): Promise<MarketEvent[]> {
    const mockEvents: MarketEvent[] = [];
    
    if (symbols.includes('RELIANCE') && Math.random() > 0.7) {
      mockEvents.push({
        symbol: 'RELIANCE',
        type: 'NEWS_HIGH_IMPACT',
        title: 'Reliance Announces Major Green Energy Investment',
        timestamp: new Date(),
      });
    }

    if (symbols.includes('TCS') && Math.random() > 0.8) {
      mockEvents.push({
        symbol: 'TCS',
        type: 'CORPORATE_EARNINGS',
        title: 'TCS Q3 Results Exceed Expectations',
        timestamp: new Date(),
      });
    }

    return mockEvents;
  }
}
