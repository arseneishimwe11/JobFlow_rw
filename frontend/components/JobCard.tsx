import React, { useState } from 'react';
import { MapPin, Clock, Building, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import JobModal from './JobModal';
import type { Job } from '../lib/apiClient';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`group p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
            : 'bg-white/70 border-white/40 hover:bg-white/90 hover:border-white/60'
        } shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
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
              {formatDate(job.postedDate || job.createdAt)}
            </span>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <p className={`text-sm mb-4 line-clamp-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {job.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.category && (
            <Badge variant="secondary" className={`${
              theme === 'dark' 
                ? 'bg-blue-900/30 text-blue-300 border-blue-800' 
                : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {job.category}
            </Badge>
          )}
          {job.jobType && (
            <Badge variant="outline" className={`${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-300' 
                : 'border-gray-300 text-gray-600'
            }`}>
              {job.jobType}
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            via {job.source}
          </span>
          
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
      </div>

      <JobModal
        job={job}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
