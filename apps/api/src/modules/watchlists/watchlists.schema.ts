import { z } from 'zod';

export const createWatchlistSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  }),
});

export const updateWatchlistSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  }),
});

export const addStockToWatchlistSchema = z.object({
  body: z.object({
    stockId: z.string().min(1, 'Stock ID is required'),
  }),
});

export type CreateWatchlistInput = z.infer<typeof createWatchlistSchema>['body'];
export type UpdateWatchlistInput = z.infer<typeof updateWatchlistSchema>['body'];
export type AddStockToWatchlistInput = z.infer<typeof addStockToWatchlistSchema>['body'];
