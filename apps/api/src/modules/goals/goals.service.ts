import { prisma } from '../../db.js';
import { CreateGoalInput, AddGoalStockInput } from './goals.schema.js';
import { AppError } from '../../middleware/errorHandler.js';

export class GoalsService {
  async getUserGoals(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      include: {
        stocks: {
          include: { stock: true },
        },
      },
      orderBy: { targetDate: 'asc' },
    });
  }

  async createGoal(userId: string, data: CreateGoalInput) {
    return prisma.goal.create({
      data: {
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        targetDate: new Date(data.targetDate),
        stocks: {
          create: data.stocks?.map(s => ({
            stockId: s.stockId,
            allocationPercentage: s.allocationPercentage,
          })) || [],
        },
      },
      include: { stocks: { include: { stock: true } } },
    });
  }

  async deleteGoal(userId: string, goalId: string) {
    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || goal.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Goal not found');
    }

    await prisma.goal.delete({ where: { id: goalId } });
    return { success: true };
  }

  async addStockToGoal(userId: string, goalId: string, data: AddGoalStockInput) {
    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || goal.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Goal not found');
    }

    return prisma.goalStock.upsert({
      where: {
        goalId_stockId: {
          goalId,
          stockId: data.stockId,
        },
      },
      update: {
        allocationPercentage: data.allocationPercentage,
      },
      create: {
        goalId,
        stockId: data.stockId,
        allocationPercentage: data.allocationPercentage,
      },
    });
  }

  async removeStockFromGoal(userId: string, goalId: string, stockId: string) {
    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || goal.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Goal not found');
    }

    await prisma.goalStock.deleteMany({
      where: { goalId, stockId },
    });

    return { success: true };
  }
}

export const goalsService = new GoalsService();
