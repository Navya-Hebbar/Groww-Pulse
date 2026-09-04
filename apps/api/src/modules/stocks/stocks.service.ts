import { prisma } from '../../db.js';

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
}

export const stocksService = new StocksService();
