import { AttentionLevel, Quote, ATTENTION_WEIGHTS, ATTENTION_LEVELS } from '@groww-pulse/shared';
import { prisma } from '../db.js';

export class ChangeDetectionService {
  async evaluateChanges(
    userId: string,
    stockId: string,
    currentQuote: Quote,
    preferences: any,
    goalAllocations: { stockId: string; allocationPercentage: number; goalId: string }[]
  ) {
    const lastSeenState = await prisma.userStockState.findUnique({
      where: { userId_stockId: { userId, stockId } },
    });

    const baselinePrice = lastSeenState?.lastSeenPrice ?? currentQuote.previousClose;
    const baselineVolume = lastSeenState?.lastSeenVolume ?? 1000000;

    const changes = [];
    let totalScore = 0;

    if (preferences.priceMovementEnabled) {
      const priceDiff = currentQuote.price - baselinePrice;
      const priceChangePercent = Math.abs((priceDiff / baselinePrice) * 100);
      
      if (priceChangePercent >= ATTENTION_WEIGHTS.priceMovement.thresholds.moderate) {
        changes.push({
          type: priceDiff > 0 ? 'PRICE_SPIKE' : 'PRICE_DROP',
          title: `Price moved by ${priceChangePercent.toFixed(2)}%`,
          description: `Since you last checked, the price changed from ₹${baselinePrice} to ₹${currentQuote.price}.`,
          impactScore: ATTENTION_WEIGHTS.priceMovement.maxPoints,
        });
        totalScore += ATTENTION_WEIGHTS.priceMovement.maxPoints;
      }
    }

    if (preferences.volumeAnomalyEnabled && currentQuote.volume > baselineVolume * ATTENTION_WEIGHTS.volumeAnomaly.thresholds.elevated) {
      changes.push({
        type: 'VOLUME_ANOMALY',
        title: 'Unusually high trading volume',
        description: `Trading volume is significantly higher than usual.`,
        impactScore: ATTENTION_WEIGHTS.volumeAnomaly.maxPoints,
      });
      totalScore += ATTENTION_WEIGHTS.volumeAnomaly.maxPoints;
    }

    const relatedGoals = goalAllocations.filter(g => g.stockId === stockId);
    if (relatedGoals.length > 0) {
      totalScore += ATTENTION_WEIGHTS.personalRelevance.maxPoints;
    }

    let attentionLevel: AttentionLevel = AttentionLevel.NORMAL;
    if (totalScore >= ATTENTION_LEVELS.CRITICAL.min) {
      attentionLevel = AttentionLevel.CRITICAL;
    } else if (totalScore >= ATTENTION_LEVELS.HIGH.min) {
      attentionLevel = AttentionLevel.HIGH;
    } else if (totalScore >= ATTENTION_LEVELS.WORTH_WATCHING.min) {
      attentionLevel = AttentionLevel.WORTH_WATCHING;
    }

    return {
      stockId,
      symbol: currentQuote.symbol,
      attentionLevel,
      attentionScore: Number(totalScore.toFixed(2)),
      changes,
      freshness: 'FRESH',
      lastSeenAt: lastSeenState?.lastSeenAt ?? null,
      currentPrice: currentQuote.price,
    };
  }
}

export const changeDetectionService = new ChangeDetectionService();
