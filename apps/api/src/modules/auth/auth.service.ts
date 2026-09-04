import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db.js';
import { AppError } from '../../middleware/errorHandler.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { API_CONFIG } from '@groww-pulse/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email is already registered.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        preferences: {
          create: {
            priceMovementEnabled: true,
            volumeAnomalyEnabled: true,
            corporateEventsEnabled: true,
            week52EventsEnabled: true,
            newsEnabled: true,
            minimumAttentionScore: 0,
          },
        },
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: API_CONFIG.jwtExpiry,
    });

    return {
      user: { id: user.id, email: user.email },
      token,
    };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: API_CONFIG.jwtExpiry,
    });

    return {
      user: { id: user.id, email: user.email },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found.');
    }

    return {
      id: user.id,
      email: user.email,
      preferences: user.preferences,
    };
  }
}

export const authService = new AuthService();
