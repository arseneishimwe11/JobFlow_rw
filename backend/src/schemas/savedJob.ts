import { z } from 'zod';

export const saveJobSchema = z.object({
  jobId: z.number().int().positive('Invalid job ID'),
  userId: z.number().int().positive('Invalid user ID'),
});

export const unsaveJobSchema = z.object({
  jobId: z.number().int().positive('Invalid job ID'),
  userId: z.number().int().positive('Invalid user ID'),
});

export type SaveJobInput = z.infer<typeof saveJobSchema>;
export type UnsaveJobInput = z.infer<typeof unsaveJobSchema>;
