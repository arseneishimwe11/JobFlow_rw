import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AdminJobForm from '../components/admin/AdminJobForm';
import BulkJobUpload from '../components/admin/BulkJobUpload';
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Upload,
  LogOut
} from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import type { DashboardStatsResponse, JobsListResponse, Job } from '../lib/apiClient';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showJobForm, setShowJobForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/akazi-admin/login');
  };

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.stats.getDashboard(),
  });

  const { data: recentJobs, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['admin-recent-jobs'],
    queryFn: () => apiClient.jobs.list({ limit: 10, page: 1 }),
  });

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await apiClient.jobs.delete(jobId);
        alert('Job deleted successfully');
        refetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleJobFormClose = () => {
    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleJobFormSuccess = () => {
    refetchJobs();
  };

  const statsCards = [
    {
      title: 'Total Jobs',
      value: stats?.overview?.jobs?.total || 0,
      icon: Briefcase,
      color: 'from-blue-600 to-cyan-600',
      description: `${stats?.overview?.jobs?.active || 0} active`,
    },
    {
      title: 'Total Companies',
      value: stats?.overview?.companies?.total || 0,
      icon: Building2,
      color: 'from-green-600 to-emerald-600',
      description: 'Registered companies',
    },
    {
      title: 'Total Users',
      value: stats?.overview?.users?.total || 0,
      icon: Users,
      color: 'from-purple-600 to-pink-600',
      description: `${stats?.overview?.users?.admins || 0} admins`,
    },
    {
      title: 'This Month',
      value: stats?.overview?.jobs?.thisMonth || 0,
      icon: TrendingUp,
      color: 'from-orange-600 to-red-600',
      description: 'New jobs posted',
    },
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-4xl font-extrabold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Admin Dashboard
            </h1>
            <p className={`mt-2 text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Welcome back, <span className="font-semibold">{user?.name || 'Admin'}</span> • Manage jobs and content
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`${
                theme === 'dark'
                  ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={() => setShowBulkUpload(true)}
              variant="outline"
              className={`${
                theme === 'dark'
                  ? 'border-white/20 text-gray-300 hover:bg-white/10'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
            <Button
              onClick={() => setShowJobForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className={`${
              theme === 'dark' 
                ? 'bg-white/10 border-white/20 backdrop-blur-xl' 
                : 'bg-white/80 border-white/40 backdrop-blur-xl shadow-lg'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {statsLoading ? '...' : stat.value.toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {stat.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-3 ${
            theme === 'dark' 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/80 border-white/40'
          }`}>
            <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <Card className={`${
              theme === 'dark' 
                ? 'bg-white/10 border-white/20 backdrop-blur-xl' 
                : 'bg-white/80 border-white/40 backdrop-blur-xl shadow-lg'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Recent Job Postings
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Latest jobs posted on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                      } animate-pulse`}>
                        <div className={`h-4 rounded w-3/4 mb-2 ${
                          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                        }`} />
                        <div className={`h-3 rounded w-1/2 ${
                          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                        }`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs?.jobs?.slice(0, 10).map((job: any) => (
                      <div key={job.id} className={`p-4 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      } transition-colors`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {job.title}
                              </h3>
                              {job.isFeatured && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className={`flex items-center space-x-4 text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              <span className="flex items-center">
                                <Building2 className="w-4 h-4 mr-1" />
                                {job.company}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                              {job.salaryRange && (
                                <span className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {job.salaryRange}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditJob(job)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className={`${
              theme === 'dark' 
                ? 'bg-white/10 border-white/20 backdrop-blur-xl' 
                : 'bg-white/80 border-white/40 backdrop-blur-xl shadow-lg'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Platform Analytics
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Detailed insights and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-center py-12 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className={`${
              theme === 'dark' 
                ? 'bg-white/10 border-white/20 backdrop-blur-xl' 
                : 'bg-white/80 border-white/40 backdrop-blur-xl shadow-lg'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Admin Settings
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Manage platform settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-center py-12 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Settings panel coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Form Modal */}
      <AdminJobForm 
        open={showJobForm} 
        onOpenChange={handleJobFormClose}
        job={editingJob}
        onSuccess={handleJobFormSuccess}
      />

      {/* Bulk Upload Modal */}
      <BulkJobUpload
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        onSuccess={handleJobFormSuccess}
      />
    </div>
  );
}
