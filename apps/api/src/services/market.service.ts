import { Quote } from '@groww-pulse/shared';
import { prisma } from '../db.js';

class MarketService {
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

  /**
   * Fetches latest market quotes for a list of symbols.
   * In a real app, this would call AlphaVantage, Yahoo Finance, or Groww APIs.
   * For the hackathon, we simulate live data with random walk.
   */
  async getQuotes(symbols: string[]): Promise<Quote[]> {
    // Determine freshness state based on market hours
    // Simplified for demo: assume market is open and data is fresh
    const now = new Date();
    
    return symbols.map((symbol) => {
      const basePrice = this.basePrices[symbol] || 1000;
      
      // Random walk: +/- 1.5%
      const changePercent = (Math.random() - 0.5) * 3; 
      const currentPrice = basePrice * (1 + changePercent / 100);
      const previousClose = basePrice;
      const change = currentPrice - previousClose;
      
      // Simulate volume anomaly for random stocks (10% chance)
      const isVolumeAnomaly = Math.random() > 0.9;
      const volume = isVolumeAnomaly ? 5000000 : 1000000;

      return {
        symbol,
        currentPrice: Number(currentPrice.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume,
        previousClose,
        high: Number((currentPrice * 1.01).toFixed(2)),
        low: Number((currentPrice * 0.99).toFixed(2)),
        lastUpdated: now,
        freshness: 'FRESH',
      };
    });
  }

  /**
   * Fetches latest market events (news, corporate actions)
   */
  async getEvents(symbols: string[]) {
    // Mock events for demo purposes
    const mockEvents = [];
    
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

export const marketService = new MarketService();
