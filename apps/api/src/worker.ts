import { marketWorker, setupSchedules } from './queue/index.js';
import { prisma } from './db.js';

async function startWorker() {
  try {
    await prisma.$connect();
    console.log('✅ Worker connected to database');
    
    await setupSchedules();
    console.log('✅ Worker schedules configured');
    
    console.log('🚀 Groww Pulse Background Worker is running');
    
    // Keep alive is handled by BullMQ worker instance
  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down worker...');
  await marketWorker.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down worker...');
  await marketWorker.close();
  await prisma.$disconnect();
  process.exit(0);
});

startWorker();
