import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Building, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient } from '../lib/apiClient';
import JobSharing from '../components/JobSharing';
import type { Job } from '../lib/apiClient';

export default function JobDetailPage() {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [showSharing, setShowSharing] = React.useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => apiClient.jobs.get({ id: parseInt(id!) }),
    enabled: !!id,
  });

  // Update meta tags for SEO and social sharing
  useEffect(() => {
    if (job) {
      // Update title
      document.title = `${job.title} at ${job.company} | Rwanda Job Platform`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Check out this ${job.title} position at ${job.company} in ${job.location}`);
      }
      
      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      
      if (ogTitle) ogTitle.setAttribute('content', `${job.title} at ${job.company}`);
      if (ogDescription) ogDescription.setAttribute('content', `Check out this ${job.title} position at ${job.company} in ${job.location}`);
      if (ogUrl) ogUrl.setAttribute('content', `https://akazi.rw/jobs/${job.id}`);
    }
  }, [job]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = () => {
    if (job?.link) {
      window.open(job.link, '_blank');
    }
  };

  const handleShare = () => {
    setShowSharing(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'
          }`}>
            <Building className={`w-8 h-8 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Job Not Found
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => window.history.back()}
            className={`mt-6 px-6 py-3 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
            } text-white font-medium`}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className={`mb-4 ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white hover:bg-white/10' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}>
          ← Back to Jobs
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {job.title}
            </h1>
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
              }`}>
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                theme === 'dark' 
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}>
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className={`w-4 h-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Posted {formatDate(job.published || job.createdAt)}
            </span>
          </div>
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            via Job Platform
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.type && (
            <Badge variant="secondary" className={`${
              theme === 'dark' 
                ? 'bg-blue-900/30 text-blue-300 border-blue-800' 
                : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {job.type}
            </Badge>
          )}
          {(job as any).jobType && (
            <Badge variant="outline" className={`${
              theme === 'dark' 
                ? 'border-purple-600 text-purple-300' 
                : 'border-purple-300 text-purple-600'
            }`}>
              {(job as any).jobType}
            </Badge>
          )}
          {(job as any).category && (
            <Badge variant="outline" className={`${
              theme === 'dark' 
                ? 'border-cyan-600 text-cyan-300' 
                : 'border-cyan-300 text-cyan-600'
            }`}>
              {(job as any).category}
            </Badge>
          )}
          {job.salaryRange && (
            <Badge variant="outline" className={`${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-300' 
                : 'border-gray-300 text-gray-600'
            }`}>
              {job.salaryRange}
            </Badge>
          )}
          {job.experience && (
            <Badge variant="outline" className={`${
              theme === 'dark' 
                ? 'border-green-600 text-green-300' 
                : 'border-green-300 text-green-600'
            }`}>
              {job.experience}
            </Badge>
          )}
          {job.deadline && (
            <Badge variant="outline" className={`${
              theme === 'dark' 
                ? 'border-orange-600 text-orange-300' 
                : 'border-orange-300 text-orange-600'
            }`}>
              Deadline: {job.deadline}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Description */}
        {(job as any).description && (
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Job Description
            </h2>
            <div className={`prose max-w-none ${
              theme === 'dark' ? 'prose-invert text-gray-300' : 'text-gray-700'
            }`}>
              <p className="whitespace-pre-wrap">{(job as any).description}</p>
            </div>
          </div>
        )}

        {/* Requirements */}
        {(job as any).requirements && (
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Requirements
            </h2>
            <div className={`prose max-w-none ${
              theme === 'dark' ? 'prose-invert text-gray-300' : 'text-gray-700'
            }`}>
              <p className="whitespace-pre-wrap">{(job as any).requirements}</p>
            </div>
          </div>
        )}

        {/* Apply Section */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-white/10' 
            : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
        } backdrop-blur-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Ready to apply?
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Click below to apply directly on the company's website
              </p>
            </div>
            <Button
              onClick={handleApply}
              disabled={!job.link}
              className={`px-8 py-4 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg`}>
              Apply Now
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Job Sharing Modal */}
      <JobSharing
        job={job}
        isOpen={showSharing}
        onClose={() => setShowSharing(false)}
      />
    </div>
  );
}