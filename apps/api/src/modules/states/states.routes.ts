import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { statesService } from './states.service.js';

export const statesRouter = Router();

statesRouter.use(authenticate);

statesRouter.post('/:stockId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPrice, currentVolume } = req.body;
    
    if (currentPrice === undefined || currentVolume === undefined) {
      res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'currentPrice and currentVolume are required' } });
      return;
    }

    const state = await statesService.updateUserState(
      req.userId!,
      req.params.stockId as string,
      currentPrice,
      currentVolume
    );

    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
});
