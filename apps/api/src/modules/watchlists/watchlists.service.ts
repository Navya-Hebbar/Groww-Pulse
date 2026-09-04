import { prisma } from '../../db.js';
import { AppError } from '../../middleware/errorHandler.js';
import { CreateWatchlistInput, UpdateWatchlistInput, AddStockToWatchlistInput } from './watchlists.schema.js';

export class WatchlistsService {
  async getUserWatchlists(userId: string) {
    return prisma.watchlist.findMany({
      where: { userId },
      include: {
        stocks: {
          include: { stock: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createWatchlist(userId: string, data: CreateWatchlistInput) {
    return prisma.watchlist.create({
      data: {
        userId,
        name: data.name,
      },
      include: { stocks: { include: { stock: true } } },
    });
  }

  async updateWatchlist(userId: string, watchlistId: string, data: UpdateWatchlistInput) {
    const watchlist = await prisma.watchlist.findUnique({ where: { id: watchlistId } });
    if (!watchlist || watchlist.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Watchlist not found');
    }

    return prisma.watchlist.update({
      where: { id: watchlistId },
      data: { name: data.name },
    });
  }

  async deleteWatchlist(userId: string, watchlistId: string) {
    const watchlist = await prisma.watchlist.findUnique({ where: { id: watchlistId } });
    if (!watchlist || watchlist.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Watchlist not found');
    }

    await prisma.watchlist.delete({ where: { id: watchlistId } });
    return { success: true };
  }

  async addStock(userId: string, watchlistId: string, data: AddStockToWatchlistInput) {
    const watchlist = await prisma.watchlist.findUnique({ where: { id: watchlistId } });
    if (!watchlist || watchlist.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Watchlist not found');
    }

    try {
      await prisma.watchlistStock.create({
        data: {
          watchlistId,
          stockId: data.stockId,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Ignore duplicate error, it's fine if they add an existing stock
        return { success: true, message: 'Stock already in watchlist' };
      }
      throw error;
    }
    return { success: true };
  }

  async removeStock(userId: string, watchlistId: string, stockId: string) {
    const watchlist = await prisma.watchlist.findUnique({ where: { id: watchlistId } });
    if (!watchlist || watchlist.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Watchlist not found');
    }

    await prisma.watchlistStock.deleteMany({
      where: {
        watchlistId,
        stockId,
      },
    });

    return { success: true };
  }
}

export const watchlistsService = new WatchlistsService();
