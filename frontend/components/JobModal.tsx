import React from 'react';
import { X, MapPin, Clock, Building, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from '../contexts/ThemeContext';
import type { Job } from '~backend/jobs/types';

interface JobModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobModal({ job, isOpen, onClose }: JobModalProps) {
  const { theme } = useTheme();

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = () => {
    window.open(job.source_url, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job at ${job.company}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' 
          ? 'bg-slate-900/95 border-white/10 text-white' 
          : 'bg-white/95 border-gray-200 text-gray-900'
      } backdrop-blur-xl`}>
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                {job.title}
              </DialogTitle>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-2">
                  <Building className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{job.company}</span>
                </div>
                {job.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span>{job.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className={`rounded-full ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Posted {formatDate(job.posted_date || job.created_at)}
              </span>
            </div>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              via {job.source_name}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.category && (
              <Badge variant="secondary" className={`${
                theme === 'dark' 
                  ? 'bg-blue-900/30 text-blue-300 border-blue-800' 
                  : 'bg-blue-100 text-blue-700 border-blue-200'
              }`}>
                {job.category}
              </Badge>
            )}
            {job.job_type && (
              <Badge variant="outline" className={`${
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-300' 
                  : 'border-gray-300 text-gray-600'
              }`}>
                {job.job_type}
              </Badge>
            )}
            {job.salary_range && (
              <Badge variant="outline" className={`${
                theme === 'dark' 
                  ? 'border-green-600 text-green-300' 
                  : 'border-green-300 text-green-600'
              }`}>
                {job.salary_range}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Description */}
          {job.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <div className={`prose max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className="whitespace-pre-wrap">{job.requirements}</p>
              </div>
            </div>
          )}

          {/* Apply Section */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Ready to apply?</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Click below to apply directly on the company's website
                </p>
              </div>
              <Button
                onClick={handleApply}
                className={`px-8 py-3 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg`}
              >
                Apply Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
