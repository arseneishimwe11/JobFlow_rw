import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GraduationCap, MapPin, Clock, Building, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { useJobFilters } from '../hooks/useJobFilters';
import apiClient from '../lib/apiClient';
import JobModal from '../components/JobModal';
import type { Job } from '../lib/apiClient';

export default function InternshipsPage() {
  const { theme } = useTheme();
  const { filters, updateFilter, page, setPage } = useJobFilters();

  // Override filters to only show internships
  const internshipFilters = {
    ...filters,
    jobType: 'Internship'
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['internships', internshipFilters, page],
    queryFn: async () => {
      return apiClient.jobs.list({
        ...internshipFilters,
        page,
        limit: 12,
      });
    },
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  const InternshipCard = ({ job }: { job: Job }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isSaved, setIsSaved] = React.useState(false);

    const handleSaveJob = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSaved(!isSaved);
    };

    return (
      <>
        <Card
          onClick={() => setIsModalOpen(true)}
          className={`group p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
              : 'bg-white/70 border-white/40 hover:bg-white/90 hover:border-white/60'
          } shadow-lg`}
        >
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <GraduationCap className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <Badge variant="secondary" className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 text-blue-300 border-blue-800' 
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    Internship
                  </Badge>
                </div>
                <h3 className={`text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {job.title}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Building className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {job.company}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveJob}
                className={`rounded-full ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-500" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Location and Date */}
            <div className="flex items-center justify-between mb-4">
              {job.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {job.location}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {formatDate(job.published || job.createdAt)}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.type && (
                <Badge variant="secondary" className={`${
                  theme === 'dark' 
                    ? 'bg-green-900/30 text-green-300 border-green-800' 
                    : 'bg-green-100 text-green-700 border-green-200'
                }`}>
                  {job.type}
                </Badge>
              )}
              {job.salaryRange && (
                <Badge variant="outline" className={`${
                  theme === 'dark' 
                    ? 'border-green-600 text-green-300' 
                    : 'border-green-300 text-green-600'
                }`}>
                  {job.salaryRange}
                </Badge>
              )}
              {job.deadline && (
                <Badge variant="outline" className={`${
                  theme === 'dark' 
                    ? 'border-orange-600 text-orange-300' 
                    : 'border-orange-300 text-orange-600'
                }`}>
                  Apply by {new Date(job.deadline).toLocaleDateString()}
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  theme === 'dark' 
                    ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20' 
                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                View Details
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <JobModal
          job={job}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-xl ${
            theme === 'dark' 
              ? 'bg-blue-900/30' 
              : 'bg-blue-100'
          }`}>
            <GraduationCap className={`w-8 h-8 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Internships
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Kickstart your career with internship opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-3xl backdrop-blur-xl border shadow-2xl mb-8 ${
        theme === 'dark' 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/70 border-white/40'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search internships..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className={`h-12 rounded-2xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white placeholder:text-gray-400' 
                : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
            } backdrop-blur-sm`}
          />
          
          <Input
            placeholder="Location"
            value={filters.location || ''}
            onChange={(e) => updateFilter('location', e.target.value)}
            className={`h-12 rounded-2xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white placeholder:text-gray-400' 
                : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
            } backdrop-blur-sm`}
          />
          
          <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className={`h-12 rounded-2xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white' 
                : 'bg-white/80 text-gray-900'
            } backdrop-blur-sm`}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {isLoading ? 'Loading...' : `${data?.pagination?.total || 0} Internships Found`}
        </h2>
        {data && (
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Page {data.pagination.page} of {data.pagination.totalPages}
          </p>
        )}
      </div>

      {/* Internship Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className={`p-6 rounded-3xl ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-white/40'
            }`}>
              <div className="animate-pulse space-y-4">
                <div className={`h-4 rounded w-3/4 ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                }`} />
                <div className={`h-3 rounded w-1/2 ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                }`} />
                <div className={`h-3 rounded w-2/3 ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                }`} />
              </div>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'
            }`}>
              <GraduationCap className={`w-8 h-8 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Error loading internships
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Please try again later
            </p>
          </div>
        ) : data?.jobs?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
            }`}>
              <GraduationCap className={`w-8 h-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No internships found
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          data?.jobs?.map((job) => (
            <InternshipCard key={job.id} job={job} />
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`${
              theme === 'dark' 
                ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </Button>
          
          <span className={`flex items-center px-4 py-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Page {page} of {data.pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === data.pagination.totalPages}
            className={`${
              theme === 'dark' 
                ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}