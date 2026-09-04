// ──────────────────────────────────────────────
// Groww Pulse — Server Entry Point
// ──────────────────────────────────────────────

import { app } from './app.js';
import { prisma } from './db.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

async function start() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`\n🚀 Groww Pulse API running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   Ready:  http://localhost:${PORT}/ready\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
