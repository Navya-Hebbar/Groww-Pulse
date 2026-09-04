import { AttentionLevel, FreshnessState, Quote, API_CONFIG } from '@groww-pulse/shared';
import { prisma } from '../db.js';

export class ChangeDetectionService {
  /**
   * Evaluates meaningful changes for a specific user and stock.
   */
  async evaluateChanges(
    userId: string,
    stockId: string,
    currentQuote: Quote,
    preferences: any,
    goalAllocations: { stockId: string; allocationPercentage: number; goalId: string }[]
  ) {
    // 1. Fetch user's last seen state for this stock
    const lastSeenState = await prisma.userStockState.findUnique({
      where: { userId_stockId: { userId, stockId } },
    });

    // Determine baseline (either last seen or yesterday's close if never seen)
    const baselinePrice = lastSeenState?.lastSeenPrice ?? currentQuote.previousClose;
    const baselineVolume = lastSeenState?.lastSeenVolume ?? 1000000;

    const changes = [];
    let totalScore = 0;

    // 2. Price Movement Detection
    if (preferences.priceMovementEnabled) {
      const priceDiff = currentQuote.currentPrice - baselinePrice;
      const priceChangePercent = Math.abs((priceDiff / baselinePrice) * 100);
      
      if (priceChangePercent >= API_CONFIG.thresholds.price) {
        changes.push({
          type: priceDiff > 0 ? 'PRICE_SPIKE' : 'PRICE_DROP',
          title: `Price moved by ${priceChangePercent.toFixed(2)}%`,
          description: `Since you last checked, the price changed from ₹${baselinePrice} to ₹${currentQuote.currentPrice}.`,
          impactScore: API_CONFIG.weights.price,
        });
        totalScore += API_CONFIG.weights.price;
      }
    }

    // 3. Volume Anomaly Detection
    if (preferences.volumeAnomalyEnabled && currentQuote.volume > baselineVolume * API_CONFIG.thresholds.volumeMultiplier) {
      changes.push({
        type: 'VOLUME_ANOMALY',
        title: 'Unusually high trading volume',
        description: `Trading volume is significantly higher than usual.`,
        impactScore: API_CONFIG.weights.volume,
      });
      totalScore += API_CONFIG.weights.volume;
    }

    // 4. Goal Relevance Boost
    const relatedGoals = goalAllocations.filter(g => g.stockId === stockId);
    if (relatedGoals.length > 0) {
      const maxAllocation = Math.max(...relatedGoals.map(g => g.allocationPercentage));
      const goalBoost = maxAllocation * API_CONFIG.weights.goalRelevance;
      totalScore += goalBoost;
    }

    // Determine attention level
    let attentionLevel: AttentionLevel = 'NORMAL';
    if (totalScore >= API_CONFIG.attentionThresholds.critical) {
      attentionLevel = 'CRITICAL';
    } else if (totalScore >= API_CONFIG.attentionThresholds.high) {
      attentionLevel = 'HIGH';
    } else if (totalScore >= API_CONFIG.attentionThresholds.watching) {
      attentionLevel = 'WATCHING';
    }

    return {
      stockId,
      symbol: currentQuote.symbol,
      attentionLevel,
      attentionScore: Number(totalScore.toFixed(2)),
      changes,
      freshness: currentQuote.freshness,
      lastSeenAt: lastSeenState?.lastSeenAt ?? null,
      currentPrice: currentQuote.currentPrice,
    };
  }
}

export const changeDetectionService = new ChangeDetectionService();
