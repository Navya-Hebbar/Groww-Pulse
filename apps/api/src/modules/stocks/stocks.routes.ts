import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { stocksService } from './stocks.service.js';

export const stockRouter = Router();

stockRouter.use(authenticate);

stockRouter.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    const stocks = await stocksService.searchStocks(query);
    res.json({ success: true, data: stocks });
  } catch (error) {
    next(error);
  }
});

