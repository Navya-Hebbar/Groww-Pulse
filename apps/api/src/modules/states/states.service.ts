import { prisma } from '../../db.js';

export class StatesService {
  async getUserState(userId: string, stockId: string) {
    return prisma.userStockState.findUnique({
      where: {
        userId_stockId: {
          userId,
          stockId,
        },
      },
    });
  }

  async updateUserState(userId: string, stockId: string, currentPrice: number, currentVolume: number) {
    return prisma.userStockState.upsert({
      where: {
        userId_stockId: {
          userId,
          stockId,
        },
      },
      update: {
        lastSeenAt: new Date(),
        lastSeenPrice: currentPrice,
        lastSeenVolume: currentVolume,
      },
      create: {
        userId,
        stockId,
        lastSeenAt: new Date(),
        lastSeenPrice: currentPrice,
        lastSeenVolume: currentVolume,
      },
    });
  }

  async markAllSeen(userId: string) {
    const stocks = await prisma.stock.findMany();
    const updates = stocks.map((stock) =>
      prisma.userStockState.upsert({
        where: { userId_stockId: { userId, stockId: stock.id } },
        update: { lastSeenAt: new Date() },
        create: {
          userId,
          stockId: stock.id,
          lastSeenAt: new Date(),
          lastSeenPrice: 1000,
          lastSeenVolume: 1000000,
        },
      })
    );
    await prisma.$transaction(updates);
    return { success: true, count: stocks.length };
  }
}

export const statesService = new StatesService();

