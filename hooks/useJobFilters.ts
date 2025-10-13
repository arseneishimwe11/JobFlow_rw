import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  jobType?: string;
  type?: 'Job' | 'Internship';
  source?: string;
  dateRange?: string;
  featured?: boolean;
}

export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<JobFilters>(() => {
    // Initialize filters from URL search params
    const initialFilters: JobFilters = {};
    
    if (searchParams.has('search')) initialFilters.search = searchParams.get('search') || undefined;
    if (searchParams.has('location')) initialFilters.location = searchParams.get('location') || undefined;
    if (searchParams.has('category')) initialFilters.category = searchParams.get('category') || undefined;
    if (searchParams.has('jobType')) initialFilters.jobType = searchParams.get('jobType') || undefined;
    if (searchParams.has('source')) initialFilters.source = searchParams.get('source') || undefined;
    if (searchParams.has('dateRange')) initialFilters.dateRange = searchParams.get('dateRange') || undefined;
    if (searchParams.has('featured')) initialFilters.featured = searchParams.get('featured') === 'true';
    
    return initialFilters;
  });
  
  const [page, setPage] = useState(() => {
    return parseInt(searchParams.get('page') || '1', 10);
  });

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, String(value));
      }
    });
    
    if (page > 1) {
      newParams.set('page', String(page));
    }
    
    setSearchParams(newParams, { replace: true });
  }, [filters, page, setSearchParams]);

  const updateFilter = useCallback((key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === null || value === '' ? undefined : value
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