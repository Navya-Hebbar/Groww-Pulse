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
}

export const statesService = new StatesService();
