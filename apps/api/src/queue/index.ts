import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../db.js';
import { marketService } from '../services/market.service.js';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const marketRefreshQueue = new Queue('market-refresh', {
  connection: redisConnection,
});

// Setup recurring job (e.g., every 5 minutes during market hours)
export async function setupSchedules() {
  await marketRefreshQueue.add(
    'refresh-all-stocks',
    {},
    {
      repeat: {
        pattern: '*/5 * * * *', // Every 5 minutes
      },
    }
  );
  console.log('⏱️ Scheduled market-refresh job');
}

export const marketWorker = new Worker(
  'market-refresh',
  async (job) => {
    console.log(`[Worker] Processing job ${job.name}...`);
    
    // In a real scenario, this would fetch latest data and update MarketSnapshot table,
    // and maybe evaluate alerts immediately. For the hackathon, we simulate it.
    
    // Fetch all unique stocks in the system
    const stocks = await prisma.stock.findMany({ select: { symbol: true } });
    const symbols = stocks.map((s: any) => s.symbol);
    
    if (symbols.length > 0) {
      console.log(`[Worker] Refreshing quotes for ${symbols.length} stocks...`);
      // Simulating a bulk API call to market data provider
      await marketService.getQuotes(symbols);
    }
    
    console.log(`[Worker] Completed job ${job.name}.`);
  },
  {
    connection: redisConnection,
  }
);

marketWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err);
});
