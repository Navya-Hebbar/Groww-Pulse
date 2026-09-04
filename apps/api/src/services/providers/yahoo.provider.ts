import yahooFinanceLib from 'yahoo-finance2';
const YahooFinanceClass = (yahooFinanceLib as any).default || yahooFinanceLib;
const yahooFinance = new YahooFinanceClass();

// Suppress the node version warning for clean logs in hackathon
if (typeof yahooFinance?.suppressNotices === 'function') {
  yahooFinance.suppressNotices(['yahooFinance.env']);
}

import { Quote } from '@groww-pulse/shared';
import { MarketProvider, MarketEvent } from './market.provider.js';

export class YahooFinanceProvider implements MarketProvider {
  // Common Indian stocks to automatically append .NS for Yahoo Finance
  private readonly NSE_SUFFIX = '.NS';
  private readonly indianStocks = [
    'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'WIPRO', 
    'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 
    'LT', 'HINDUNILVR'
  ];

  private formatSymbol(symbol: string): string {
    if (this.indianStocks.includes(symbol) && !symbol.endsWith(this.NSE_SUFFIX)) {
      return `${symbol}${this.NSE_SUFFIX}`;
    }
    return symbol;
  }

  private cleanSymbol(symbol: string): string {
    return symbol.replace(this.NSE_SUFFIX, '');
  }

  async getQuotes(symbols: string[]): Promise<Quote[]> {
    if (!symbols.length) return [];
    
    const formattedSymbols = symbols.map(s => this.formatSymbol(s));
    
    try {
      const results = await yahooFinance.quote(formattedSymbols);
      
      // yahooFinance.quote returns an array if multiple symbols are passed, 
      // but might return a single object if only one is passed.
      const quotesArray = Array.isArray(results) ? results : [results];
      
      return quotesArray.map((q: any) => ({
        symbol: this.cleanSymbol(q.symbol),
        price: q.regularMarketPrice || 0,
        volume: q.regularMarketVolume || 0,
        dayHigh: q.regularMarketDayHigh || q.regularMarketPrice || 0,
        dayLow: q.regularMarketDayLow || q.regularMarketPrice || 0,
        week52High: q.fiftyTwoWeekHigh || q.regularMarketPrice || 0,
        week52Low: q.fiftyTwoWeekLow || q.regularMarketPrice || 0,
        previousClose: q.regularMarketPreviousClose || q.regularMarketPrice || 0,
        open: q.regularMarketOpen || q.regularMarketPrice || 0,
        timestamp: new Date(),
        source: 'yahoo',
      }));
    } catch (error) {
      console.error('Error fetching quotes from Yahoo Finance:', error);
      return [];
    }
  }

  async getEvents(_symbols: string[]): Promise<MarketEvent[]> {
    // For now, we return empty events for Yahoo Finance, 
    // or we could fetch news. Keeping it empty for simplicity as per MVP.
    return [];
  }
}
