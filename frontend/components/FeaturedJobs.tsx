import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Briefcase, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '../contexts/ThemeContext';
import backend from '~backend/client';

export default function FeaturedJobs() {
  const { theme } = useTheme();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => backend.jobs.list({ limit: 6, page: 1 }),
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

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Featured Jobs
          </h2>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Hand-picked opportunities from top companies
          </p>
        </div>
        <Button 
          variant="outline" 
          className={`${
            theme === 'dark' 
              ? 'border-white/20 text-white hover:bg-white/10' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          } rounded-xl`}
        >
          View All Jobs
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className={`animate-pulse ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-white/40'
            } backdrop-blur-xl`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                  <div className={`w-16 h-6 rounded-full ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                </div>
                <div className="space-y-3">
                  <div className={`h-5 rounded ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                  <div className={`h-4 rounded w-2/3 ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                  <div className={`h-4 rounded w-1/2 ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          jobs?.jobs.slice(0, 6).map((job) => (
            <Card key={job.id} className={`group hover:scale-105 transition-all duration-300 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : 'bg-white/70 border-white/40 hover:bg-white/90 hover:border-white/60'
            } backdrop-blur-xl shadow-lg hover:shadow-2xl`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                      : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                  }`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={`${
                    theme === 'dark' 
                      ? 'bg-green-900/30 text-green-300 border-green-800' 
                      : 'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    Featured
                  </Badge>
                </div>

                <h3 className={`font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {job.title}
                </h3>

                <p className={`font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {job.company}
                </p>

                <div className="space-y-2 mb-4">
                  {job.location && (
                    <div className="flex items-center space-x-2">
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
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {formatDate(job.posted_date || job.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.job_type && (
                    <Badge variant="outline" className={`text-xs ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300' 
                        : 'border-gray-300 text-gray-600'
                    }`}>
                      {job.job_type}
                    </Badge>
                  )}
                  {job.category && (
                    <Badge variant="outline" className={`text-xs ${
                      theme === 'dark' 
                        ? 'border-blue-600 text-blue-300' 
                        : 'border-blue-300 text-blue-600'
                    }`}>
                      {job.category}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      4.5 rating
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20' 
                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
