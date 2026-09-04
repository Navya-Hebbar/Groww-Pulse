import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { preferencesService } from './preferences.service.js';
import { updatePreferencesSchema } from './preferences.schema.js';

export const preferencesRouter = Router();

preferencesRouter.use(authenticate);

preferencesRouter.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const prefs = await preferencesService.getPreferences(req.userId!);
    res.json({ success: true, data: prefs });
  } catch (error) {
    next(error);
  }
});

preferencesRouter.put('/', validate(updatePreferencesSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const prefs = await preferencesService.updatePreferences(req.userId!, req.body);
    res.json({ success: true, data: prefs });
  } catch (error) {
    next(error);
  }
});
