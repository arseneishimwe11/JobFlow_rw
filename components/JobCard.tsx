import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Building, ExternalLink, Heart, CalendarDays } from 'lucide-react';
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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if job is saved in localStorage
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedJobIds') || '[]');
    setIsSaved(savedIds.includes(job.id));
  }, [job.id]);

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
    const savedIds = JSON.parse(localStorage.getItem('savedJobIds') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const newIds = savedIds.filter((id: number) => id !== job.id);
      localStorage.setItem('savedJobIds', JSON.stringify(newIds));
      setIsSaved(false);
    } else {
      // Add to saved
      const newIds = [...savedIds, job.id];
      localStorage.setItem('savedJobIds', JSON.stringify(newIds));
      setIsSaved(true);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${job.id}`);
  };

  return (
    <>
      <div
        onClick={handleViewDetails}
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
            <Heart className={`w-5 h-5 ${
              isSaved ? 'fill-red-500 text-red-500' : ''
            }`} />
          </Button>
        </div>

        {/* Location */}
        {job.location && (
          <div className="flex items-center space-x-1 mb-3">
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
        
        {/* Experience/Expertise */}
        {job.experience && (
          <div className="mb-4">
            <Badge variant="outline" className={`text-xs ${
              theme === 'dark' 
                ? 'border-blue-600 text-blue-300 bg-blue-900/20' 
                : 'border-blue-300 text-blue-600 bg-blue-50'
            }`}>
              {job.experience}
            </Badge>
          </div>
        )}

        {/* Dates */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.published && (
            <div className="flex items-center space-x-1">
              <Clock className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Published: {job.published}
              </span>
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center space-x-1">
              <CalendarDays className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-xs ${
            theme === 'dark' 
              ? 'border-purple-600 text-purple-300' 
              : 'border-purple-300 text-purple-600'
          }`}>
            {job.type}
          </Badge>
          
          {job.link ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(job.link, '_blank');
              }}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                theme === 'dark' 
                  ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              View Original
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                theme === 'dark' 
                  ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              View Details
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          )}
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