import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building, Star, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient } from '../lib/apiClient';

interface Company {
  id: number;
  name: string;
  logo?: string;
  industry?: string;
  location?: string;
  jobCount: number;
  website?: string;
  description?: string;
  size?: string;
}

export default function TopCompanies() {
  const { theme } = useTheme();

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ['top-companies'],
    queryFn: () => apiClient.companies.getTopCompanies({ limit: 6 }),
  });

  const companies: Company[] = Array.isArray(companiesData) ? companiesData : [
    {
      id: 1,
      name: 'Rwanda Development Bank',
      logo: 'RDB',
      industry: 'Financial Services',
      location: 'Kigali',
      jobCount: 12,
    },
    {
      name: 'Zipline',
      logo: 'ZIP',
      industry: 'Healthcare Technology',
      location: 'Kigali',
      employees: '200+',
      rating: 4.9,
      openJobs: 8,
      featured: true,
    },
    {
      name: 'Bank of Kigali',
      logo: 'BK',
      industry: 'Banking',
      location: 'Kigali',
      employees: '1000+',
      rating: 4.6,
      openJobs: 15,
      featured: false,
    },
    {
      name: 'MTN Rwanda',
      logo: 'MTN',
      industry: 'Telecommunications',
      location: 'Kigali',
      employees: '800+',
      rating: 4.7,
      openJobs: 6,
      featured: false,
    },
    {
      name: 'Andela Rwanda',
      logo: 'AND',
      industry: 'Technology',
      location: 'Kigali',
      employees: '150+',
      rating: 4.9,
      openJobs: 20,
      featured: true,
    },
    {
      name: 'Equity Bank Rwanda',
      logo: 'EQB',
      industry: 'Banking',
      location: 'Kigali',
      employees: '600+',
      rating: 4.5,
      openJobs: 9,
      featured: false,
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Top Companies
          </h2>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join Rwanda's most innovative and fastest-growing companies
          </p>
        </div>
        <Button 
          variant="outline" 
          className={`${
            theme === 'dark' 
              ? 'border-white/20 text-gray-800 hover:bg-white/10' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          } rounded-xl`}
        >
          View All Companies
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id || company.name} className={`group hover:scale-105 transition-all duration-300 cursor-pointer ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
              : 'bg-white/60 border-white/40 hover:bg-white/80'
          } backdrop-blur-xl shadow-lg hover:shadow-2xl`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                      : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                  }`}>
                    
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {company.name}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {company.industry || 'Technology'}
                    </p>
                  </div>
                </div>
                
                {/* Featured badge removed as not in API response */}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {company.location || 'Kigali'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      4.5
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Users className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {company.size || '100+'} employees
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`${
                  theme === 'dark' 
                    ? 'border-green-600 text-green-300' 
                    : 'border-green-300 text-green-600'
                }`}>
                  {company.jobCount || 0} open positions
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    theme === 'dark' 
                      ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20' 
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  View Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
