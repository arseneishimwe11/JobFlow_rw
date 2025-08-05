import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import JobCard from './JobCard';
import JobCardSkeleton from './JobCardSkeleton';
import Pagination from './Pagination';
import { useJobFilters } from '../hooks/useJobFilters';
import { useTheme } from '../contexts/ThemeContext';
import backend from '~backend/client';

export default function JobGrid() {
  const { theme } = useTheme();
  const { filters, page, setPage } = useJobFilters();

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.category) params.append('category', filters.category);
      if (filters.job_type) params.append('job_type', filters.job_type);
      if (filters.source_name) params.append('source_name', filters.source_name);
      if (filters.date_range) params.append('date_range', filters.date_range);
      params.append('page', page.toString());
      params.append('limit', '12');

      return backend.jobs.list({
        search: filters.search,
        location: filters.location,
        category: filters.category,
        job_type: filters.job_type,
        source_name: filters.source_name,
        date_range: filters.date_range,
        page,
        limit: 12,
      });
    },
  });

  if (error) {
    return (
      <Alert className={`${
        theme === 'dark' 
          ? 'bg-red-900/20 border-red-800 text-red-300' 
          : 'bg-red-50 border-red-200 text-red-700'
      }`}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load jobs. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {isLoading ? 'Loading...' : `${data?.total || 0} Jobs Found`}
          </h2>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {data && `Page ${data.page} of ${data.total_pages}`}
          </p>
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))
        ) : (
          data?.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && data?.jobs.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
          }`}>
            <AlertCircle className={`w-8 h-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No jobs found
          </h3>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.total_pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
