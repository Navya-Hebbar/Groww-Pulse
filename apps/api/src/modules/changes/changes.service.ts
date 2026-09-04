import { prisma } from '../../db.js';
import { marketService } from '../../services/market.service.js';
import { changeDetectionService } from '../../services/change-detection.service.js';
import { AppError } from '../../middleware/errorHandler.js';

export class ChangesService {
  async getDashboardChanges(userId: string) {
    // 1. Fetch user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    if (!user || !user.preferences) {
      throw new AppError(404, 'NOT_FOUND', 'User preferences not found');
    }

    // 2. Fetch user's watchlists and stocks
    const watchlists = await prisma.watchlist.findMany({
      where: { userId },
      include: { stocks: { include: { stock: true } } },
    });

    const stockIds = new Set<string>();
    const stockMap = new Map<string, any>();

    watchlists.forEach(wl => {
      wl.stocks.forEach(ws => {
        stockIds.add(ws.stockId);
        stockMap.set(ws.stock.symbol, ws.stock);
      });
    });

    if (stockIds.size === 0) {
      return []; // No stocks in watchlists
    }

    // 3. Fetch user goals to get goal allocations
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: { stocks: true },
    });

    const goalAllocations = goals.flatMap(g => 
      g.stocks.map(s => ({ stockId: s.stockId, allocationPercentage: s.allocationPercentage, goalId: g.id }))
    );

    // 4. Fetch live market quotes
    const symbols = Array.from(stockMap.keys());
    const quotes = await marketService.getQuotes(symbols);

    // 5. Evaluate changes for each stock
    const results = [];
    for (const quote of quotes) {
      const stock = stockMap.get(quote.symbol);
      if (!stock) continue;

      const evaluation = await changeDetectionService.evaluateChanges(
        userId,
        stock.id,
        quote,
        user.preferences,
        goalAllocations
      );

      // Only include if attention score meets the user's minimum threshold
      if (evaluation.attentionScore >= (user.preferences.minimumAttentionScore || 0)) {
        results.push(evaluation);
      }
    }

    // 6. Sort by attention score descending
    results.sort((a, b) => b.attentionScore - a.attentionScore);

    return results;
  }
}

export const changesService = new ChangesService();
