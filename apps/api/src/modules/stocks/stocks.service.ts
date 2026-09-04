import { prisma } from '../../db.js';
import { marketService } from '../../services/market.service.js';

export class StocksService {
  async searchStocks(query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    return prisma.stock.findMany({
      where: {
        OR: [
          { symbol: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
  }

  async getQuotesForStocks(stockIds: string[]) {
    if (!stockIds || stockIds.length === 0) return [];

    const stocks = await prisma.stock.findMany({
      where: { id: { in: stockIds } },
    });

    const symbols = stocks.map((s: any) => s.symbol);
    const quotes = await marketService.getQuotes(symbols);

    // Map quotes back to stock IDs for the client
    return quotes.map((quote: any) => {
      const stock = stocks.find((s: any) => s.symbol === quote.symbol);
      return {
        ...quote,
        stockId: stock?.id,
      };
    });
  }
}

export const stocksService = new StocksService();

