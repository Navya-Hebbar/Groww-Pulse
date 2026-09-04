import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    targetAmount: z.number().positive('Amount must be positive'),
    targetDate: z.string().datetime(), // ISO string
    stocks: z.array(
      z.object({
        stockId: z.string(),
        allocationPercentage: z.number().min(0).max(100),
      })
    ).optional(),
  }),
});

export const addGoalStockSchema = z.object({
  body: z.object({
    stockId: z.string(),
    allocationPercentage: z.number().min(0).max(100),
  }),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>['body'];
export type AddGoalStockInput = z.infer<typeof addGoalStockSchema>['body'];
