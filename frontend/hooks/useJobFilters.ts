import { useState, useCallback } from 'react';

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  job_type?: string;
  source_name?: string;
  date_range?: string;
}

export function useJobFilters() {
  const [filters, setFilters] = useState<JobFilters>({});
  const [page, setPage] = useState(1);

  const updateFilter = useCallback((key: keyof JobFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  return {
    filters,
    page,
    setPage,
    updateFilter,
    clearFilters,
  };
}
