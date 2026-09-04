import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { changesService } from './changes.service.js';

export const changesRouter = Router();

changesRouter.use(authenticate);

changesRouter.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const changes = await changesService.getDashboardChanges(req.userId!);
    res.json({ success: true, data: changes });
  } catch (error) {
    next(error);
  }
});
