// ──────────────────────────────────────────────
// Groww Pulse — Database Seed
// ──────────────────────────────────────────────
// Pre-populates demo stocks, a demo user,
// watchlist, goals, and market snapshots for
// reliable presentation/demo mode.
// ──────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE', sector: 'Energy', currency: 'INR' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', exchange: 'NSE', sector: 'IT', currency: 'INR' },
  { symbol: 'INFY', name: 'Infosys Ltd.', exchange: 'NSE', sector: 'IT', currency: 'INR' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE', sector: 'Banking', currency: 'INR' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', exchange: 'NSE', sector: 'IT', currency: 'INR' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', exchange: 'NSE', sector: 'Banking', currency: 'INR' },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', sector: 'Banking', currency: 'INR' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', exchange: 'NSE', sector: 'Telecom', currency: 'INR' },
  { symbol: 'ITC', name: 'ITC Ltd.', exchange: 'NSE', sector: 'FMCG', currency: 'INR' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', exchange: 'NSE', sector: 'Banking', currency: 'INR' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', exchange: 'NSE', sector: 'Infrastructure', currency: 'INR' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', exchange: 'NSE', sector: 'FMCG', currency: 'INR' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // ── Create stocks ──
  const stocks = [];
  for (const stockData of DEMO_STOCKS) {
    const stock = await prisma.stock.upsert({
      where: { symbol_exchange: { symbol: stockData.symbol, exchange: stockData.exchange } },
      update: {},
      create: stockData,
    });
    stocks.push(stock);
  }
  console.log(`  ✓ ${stocks.length} stocks created`);

  // ── Create demo user ──
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@growwpulse.dev' },
    update: {},
    create: {
      email: 'demo@growwpulse.dev',
      passwordHash,
    },
  });
  console.log(`  ✓ Demo user created (demo@growwpulse.dev / demo1234)`);

  // ── Create demo user preferences ──
  await prisma.userPreference.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      priceMovementEnabled: true,
      volumeAnomalyEnabled: true,
      corporateEventsEnabled: true,
      week52EventsEnabled: true,
      newsEnabled: true,
      minimumAttentionScore: 0,
    },
  });
  console.log(`  ✓ Demo user preferences created`);

  // ── Create watchlist ──
  const watchlist = await prisma.watchlist.upsert({
    where: { id: 'demo-watchlist' },
    update: {},
    create: {
      id: 'demo-watchlist',
      userId: demoUser.id,
      name: 'My Watchlist',
    },
  });

  // Add first 8 stocks to watchlist
  for (const stock of stocks.slice(0, 8)) {
    await prisma.watchlistStock.upsert({
      where: { watchlistId_stockId: { watchlistId: watchlist.id, stockId: stock.id } },
      update: {},
      create: { watchlistId: watchlist.id, stockId: stock.id },
    });
  }
  console.log(`  ✓ Watchlist created with ${Math.min(8, stocks.length)} stocks`);

  // ── Create demo goals ──
  const houseGoal = await prisma.goal.upsert({
    where: { id: 'demo-goal-house' },
    update: {},
    create: {
      id: 'demo-goal-house',
      userId: demoUser.id,
      name: 'House',
      targetAmount: 5000000,
      targetDate: new Date('2030-12-31'),
    },
  });

  const educationGoal = await prisma.goal.upsert({
    where: { id: 'demo-goal-education' },
    update: {},
    create: {
      id: 'demo-goal-education',
      userId: demoUser.id,
      name: 'Education',
      targetAmount: 1500000,
      targetDate: new Date('2029-06-30'),
    },
  });

  // Link stocks to goals
  const reliance = stocks.find(s => s.symbol === 'RELIANCE')!;
  const tcs = stocks.find(s => s.symbol === 'TCS')!;
  const infy = stocks.find(s => s.symbol === 'INFY')!;

  await prisma.goalStock.upsert({
    where: { goalId_stockId: { goalId: houseGoal.id, stockId: reliance.id } },
    update: {},
    create: { goalId: houseGoal.id, stockId: reliance.id, allocationPercentage: 18 },
  });
  await prisma.goalStock.upsert({
    where: { goalId_stockId: { goalId: houseGoal.id, stockId: tcs.id } },
    update: {},
    create: { goalId: houseGoal.id, stockId: tcs.id, allocationPercentage: 12 },
  });
  await prisma.goalStock.upsert({
    where: { goalId_stockId: { goalId: educationGoal.id, stockId: infy.id } },
    update: {},
    create: { goalId: educationGoal.id, stockId: infy.id, allocationPercentage: 8 },
  });
  console.log(`  ✓ Goals created (House, Education) with stock links`);

  // ── Create user stock states (simulating "last checked" 2 hours ago) ──
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const lastSeenPrices: Record<string, number> = {
    'RELIANCE': 2760,
    'TCS': 3850,
    'INFY': 1520,
    'HDFCBANK': 1680,
    'WIPRO': 465,
    'ICICIBANK': 1120,
    'SBIN': 780,
    'BHARTIARTL': 1540,
  };

  for (const stock of stocks.slice(0, 8)) {
    const lastSeenPrice = lastSeenPrices[stock.symbol] || 1000;
    await prisma.userStockState.upsert({
      where: { userId_stockId: { userId: demoUser.id, stockId: stock.id } },
      update: {},
      create: {
        userId: demoUser.id,
        stockId: stock.id,
        lastSeenAt: twoHoursAgo,
        lastSeenPrice,
        lastSeenVolume: 1000000,
      },
    });
  }
  console.log(`  ✓ User stock states created (last checked 2 hours ago)`);

  console.log('\n✅ Seed complete!');
  console.log('   Demo login: demo@growwpulse.dev / demo1234\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
