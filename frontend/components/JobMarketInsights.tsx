import React from 'react';
import { TrendingUp, DollarSign, Clock, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';

export default function JobMarketInsights() {
  const { theme } = useTheme();

  const insights = [
    {
      title: 'Average Salary Growth',
      value: '+12.5%',
      subtitle: 'Year over year',
      icon: DollarSign,
      trend: 'up',
      color: 'text-green-500',
      bgColor: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Time to Hire',
      value: '18 days',
      subtitle: 'Average across all roles',
      icon: Clock,
      trend: 'down',
      color: 'text-blue-500',
      bgColor: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Job Market Activity',
      value: '+24%',
      subtitle: 'New postings this month',
      icon: TrendingUp,
      trend: 'up',
      color: 'text-purple-500',
      bgColor: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Remote Opportunities',
      value: '35%',
      subtitle: 'Of all job postings',
      icon: Users,
      trend: 'up',
      color: 'text-orange-500',
      bgColor: 'from-orange-500 to-amber-500',
    },
  ];

  const topSectors = [
    { name: 'Technology', growth: '+28%', jobs: 342 },
    { name: 'Financial Services', growth: '+15%', jobs: 234 },
    { name: 'Healthcare', growth: '+18%', jobs: 156 },
    { name: 'Education', growth: '+12%', jobs: 123 },
    { name: 'Manufacturing', growth: '+8%', jobs: 98 },
  ];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Job Market Insights
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Stay informed with the latest trends and data from Rwanda's job market
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Key Metrics */}
        <div className="lg:col-span-2">
          <h3 className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Key Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className={`${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/60 border-white/40'
              } backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.bgColor} flex items-center justify-center`}>
                      <insight.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {insight.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        insight.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {insight.trend === 'up' ? 'Trending up' : 'Trending down'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-3xl font-bold mb-2 ${insight.color}`}>
                    {insight.value}
                  </div>
                  
                  <h4 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.title}
                  </h4>
                  
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {insight.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Growing Sectors */}
        <div>
          <h3 className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Top Growing Sectors
          </h3>
          <Card className={`${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/60 border-white/40'
          } backdrop-blur-xl shadow-lg`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topSectors.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {sector.name}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {sector.jobs} jobs
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {sector.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
