import { useQuery } from '@tanstack/react-query';
import { jobApi } from '../lib/api';

export function useJobStats() {
  return useQuery({
    queryKey: ['job-stats'],
    queryFn: () => jobApi.stats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useJobsWithStats(filters: any = {}, page: number = 1) {
  return useQuery({
    queryKey: ['jobs-with-stats', filters, page],
    queryFn: async () => {
      const [jobs, stats] = await Promise.all([
        jobApi.list({ ...filters, page, limit: 12 }),
        jobApi.stats(),
      ]);
      return { jobs, stats };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}