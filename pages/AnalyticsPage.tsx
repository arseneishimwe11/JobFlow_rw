import React from 'react';
import { TrendingUp, Users, Briefcase, Eye, Calendar, MapPin, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '../contexts/ThemeContext';

export default function AnalyticsPage() {
  const { theme } = useTheme();

  const stats = [
    { title: 'Profile Views', value: '1,247', change: '+12%', icon: Eye, color: 'text-blue-500' },
    { title: 'Job Applications', value: '23', change: '+8%', icon: Briefcase, color: 'text-green-500' },
    { title: 'Saved Jobs', value: '45', change: '+15%', icon: TrendingUp, color: 'text-purple-500' },
    { title: 'Search Appearances', value: '892', change: '+22%', icon: Users, color: 'text-orange-500' },
  ];

  const applicationStats = [
    { status: 'Applied', count: 23, percentage: 100, color: 'bg-blue-500' },
    { status: 'Viewed', count: 18, percentage: 78, color: 'bg-yellow-500' },
    { status: 'Interview', count: 8, percentage: 35, color: 'bg-purple-500' },
    { status: 'Offer', count: 3, percentage: 13, color: 'bg-green-500' },
  ];

  const topSkills = [
    { name: 'React', searches: 45, trend: '+12%' },
    { name: 'Node.js', searches: 38, trend: '+8%' },
    { name: 'TypeScript', searches: 32, trend: '+15%' },
    { name: 'Python', searches: 28, trend: '+5%' },
    { name: 'AWS', searches: 24, trend: '+18%' },
  ];

  const jobCategories = [
    { name: 'Technology', applications: 12, percentage: 52 },
    { name: 'Marketing', applications: 6, percentage: 26 },
    { name: 'Finance', applications: 3, percentage: 13 },
    { name: 'Healthcare', applications: 2, percentage: 9 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Analytics Dashboard
        </h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Track your job search progress and optimize your profile
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {stat.change}
                </Badge>
              </div>
              
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.title}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Pipeline */}
        <Card className={`${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/70 border-white/40'
        } backdrop-blur-xl shadow-lg`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <BarChart3 className="w-5 h-5" />
              <span>Application Pipeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {applicationStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.status}
                  </span>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.count} ({stat.percentage}%)
                  </span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Job Categories */}
        <Card className={`${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/70 border-white/40'
        } backdrop-blur-xl shadow-lg`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <PieChart className="w-5 h-5" />
              <span>Applications by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-purple-500' :
                    index === 2 ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.applications}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {category.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Skills */}
      <Card className={`${
        theme === 'dark' 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/70 border-white/40'
      } backdrop-blur-xl shadow-lg`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <TrendingUp className="w-5 h-5" />
            <span>Top Skills in Your Searches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topSkills.map((skill, index) => (
              <div key={index} className={`p-4 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {skill.name}
                </h3>
                <div className={`text-2xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {skill.searches}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    searches
                  </span>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    {skill.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
