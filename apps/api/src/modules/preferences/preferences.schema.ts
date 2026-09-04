import { z } from 'zod';

export const updatePreferencesSchema = z.object({
  body: z.object({
    priceMovementEnabled: z.boolean().optional(),
    volumeAnomalyEnabled: z.boolean().optional(),
    corporateEventsEnabled: z.boolean().optional(),
    week52EventsEnabled: z.boolean().optional(),
    newsEnabled: z.boolean().optional(),
    minimumAttentionScore: z.number().min(0).max(100).optional(),
  }),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>['body'];
