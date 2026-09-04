import { Router, Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { validate } from '../../middleware/validate.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { authenticate, AuthRequest } from '../../middleware/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await authService.register(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await authService.login(req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post('/logout', (req: Request, res: Response) => {
  // Client is responsible for deleting the token
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

authRouter.get(
  '/me',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await authService.getMe(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

