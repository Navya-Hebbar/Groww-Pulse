import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { goalsService } from './goals.service.js';
import { createGoalSchema, addGoalStockSchema } from './goals.schema.js';

export const goalsRouter = Router();

goalsRouter.use(authenticate);

goalsRouter.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const goals = await goalsService.getUserGoals(req.userId!);
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
});

goalsRouter.post('/', validate(createGoalSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const goal = await goalsService.createGoal(req.userId!, req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
});

goalsRouter.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await goalsService.deleteGoal(req.userId!, req.params.id);
    res.json({ success: true, data: { message: 'Goal deleted' } });
  } catch (error) {
    next(error);
  }
});

goalsRouter.post('/:id/stocks', validate(addGoalStockSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await goalsService.addStockToGoal(req.userId!, req.params.id, req.body);
    res.json({ success: true, data: { message: 'Stock allocated to goal' } });
  } catch (error) {
    next(error);
  }
});

goalsRouter.delete('/:id/stocks/:stockId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await goalsService.removeStockFromGoal(req.userId!, req.params.id, req.params.stockId);
    res.json({ success: true, data: { message: 'Stock removed from goal' } });
  } catch (error) {
    next(error);
  }
});
