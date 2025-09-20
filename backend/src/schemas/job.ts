import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  company: z.string().min(1, 'Company is required').max(100, 'Company name too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  salaryRange: z.string().optional(),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote']),
  category: z.string().min(1, 'Category is required'),
  deadline: z.string().datetime().optional().or(z.string().length(0)),
  source: z.string().default('Manual'),
  url: z.string().url().optional().or(z.string().length(0)),
  isFeatured: z.boolean().default(false),
});

export const updateJobSchema = createJobSchema.partial();

export const jobQuerySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  jobType: z.string().optional(),
  source: z.string().optional(),
  dateRange: z.enum(['today', 'week', 'month', 'all']).optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => Math.min(parseInt(val) || 12, 50)).optional(),
  featured: z.string().transform(val => val === 'true').optional(),
});

export const bulkCreateJobsSchema = z.object({
  jobs: z.array(createJobSchema).min(1, 'At least one job is required').max(50, 'Maximum 50 jobs at once'),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobQueryInput = z.infer<typeof jobQuerySchema>;
export type BulkCreateJobsInput = z.infer<typeof bulkCreateJobsSchema>;
