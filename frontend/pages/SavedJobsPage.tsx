import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ExternalLink, Calendar, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient } from '../lib/apiClient';
import type { Job } from '../lib/apiClient';

export default function SavedJobsPage() {
  const { theme } = useTheme();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved job IDs from localStorage
  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        // Get saved job IDs from localStorage
        const savedJobIds = JSON.parse(localStorage.getItem('savedJobIds') || '[]');
        
        if (savedJobIds.length === 0) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }

        // Fetch all jobs and filter by saved IDs
        const response = await apiClient.jobs.list({ limit: 100, page: 1 });
        const jobs = response.jobs.filter((job: Job) => 
          savedJobIds.includes(job.id)
        );
        
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, []);

  // Remove job from saved list
  const removeSavedJob = (jobId: number) => {
    const savedJobIds = JSON.parse(localStorage.getItem('savedJobIds') || '[]');
    const newSavedIds = savedJobIds.filter((id: number) => id !== jobId);
    localStorage.setItem('savedJobIds', JSON.stringify(newSavedIds));
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
  };

  // Mock saved jobs data for fallback
  const mockSavedJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Andela Rwanda',
      location: 'Kigali, Rwanda',
      salary: '800,000 - 1,200,000 RWF',
      type: 'Full-time',
      category: 'Technology',
      savedAt: '2024-01-15',
      notes: 'Great company culture and remote work options',
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'Bank of Kigali',
      location: 'Kigali, Rwanda',
      salary: '600,000 - 900,000 RWF',
      type: 'Full-time',
      category: 'Marketing',
      savedAt: '2024-01-14',
      notes: 'Excellent benefits package',
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'MTN Rwanda',
      location: 'Kigali, Rwanda',
      salary: '500,000 - 750,000 RWF',
      type: 'Full-time',
      category: 'Technology',
      savedAt: '2024-01-12',
      notes: '',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 flex items-center space-x-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <Heart className="w-8 h-8 text-red-500" />
          <span>Saved Jobs</span>
        </h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Keep track of jobs you're interested in
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <Card className={`text-center py-12 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/70 border-white/40'
        } backdrop-blur-xl`}>
          <CardContent>
            <Heart className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No saved jobs yet
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Start browsing jobs and save the ones you're interested in
            </p>
            <Button className={`${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } text-white`}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {savedJobs.map((job) => (
            <Card key={job.id} className={`group hover:scale-[1.02] transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/70 border-white/40 hover:bg-white/90'
            } backdrop-blur-xl shadow-lg hover:shadow-2xl`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Building className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {job.company}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`text-red-500 hover:text-red-600 hover:bg-red-50 ${
                        theme === 'dark' ? 'hover:bg-red-900/20' : ''
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className={`text-xs ${
                    theme === 'dark' 
                      ? 'border-blue-600 text-blue-300 bg-blue-900/20' 
                      : 'border-blue-400 text-blue-600 bg-blue-100/60'
                  }`}>
                    {job.job_type || 'Full-time'}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${
                    theme === 'dark' 
                      ? 'border-gray-600 text-gray-300 bg-gray-900/20' 
                      : 'border-gray-400 text-gray-600 bg-gray-100/60'
                  }`}>
                    {job.category || 'Technology'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {job.salary_range || 'Competitive salary'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Saved recently
                    </span>
                  </div>
                </div>

                {job.notes && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    theme === 'dark' 
                      ? 'bg-white/5 border border-white/10' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong>Notes:</strong> {job.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Saved on {new Date(job.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        theme === 'dark' 
                          ? 'border-white/20 text-white hover:bg-white/10' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Edit Notes
                    </Button>
                    <Button
                      size="sm"
                      className={`${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      } text-white`}
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
