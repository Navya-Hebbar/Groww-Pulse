import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { watchlistsService } from './watchlists.service.js';
import {
  createWatchlistSchema,
  updateWatchlistSchema,
  addStockToWatchlistSchema,
} from './watchlists.schema.js';

export const watchlistRouter = Router();

// All watchlist routes require authentication
watchlistRouter.use(authenticate);

watchlistRouter.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const watchlists = await watchlistsService.getUserWatchlists(req.userId!);
    res.json({ success: true, data: watchlists });
  } catch (error) {
    next(error);
  }
});

watchlistRouter.post(
  '/',
  validate(createWatchlistSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const watchlist = await watchlistsService.createWatchlist(req.userId!, req.body);
      res.status(201).json({ success: true, data: watchlist });
    } catch (error) {
      next(error);
    }
  }
);

watchlistRouter.put(
  '/:id',
  validate(updateWatchlistSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const watchlist = await watchlistsService.updateWatchlist(req.userId!, req.params.id as string, req.body);
      res.json({ success: true, data: watchlist });
    } catch (error) {
      next(error);
    }
  }
);

watchlistRouter.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await watchlistsService.deleteWatchlist(req.userId!, req.params.id as string);
    res.json({ success: true, data: { message: 'Watchlist deleted' } });
  } catch (error) {
    next(error);
  }
});

watchlistRouter.post(
  '/:id/stocks',
  validate(addStockToWatchlistSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await watchlistsService.addStock(req.userId!, req.params.id as string, req.body);
      res.status(201).json({ success: true, data: { message: 'Stock added to watchlist' } });
    } catch (error) {
      next(error);
    }
  }
);

watchlistRouter.delete('/:id/stocks/:stockId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await watchlistsService.removeStock(req.userId!, req.params.id as string, req.params.stockId as string);
    res.json({ success: true, data: { message: 'Stock removed from watchlist' } });
  } catch (error) {
    next(error);
  }
});

