import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building, MapPin, Users, Star, ExternalLink, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient, CompaniesListResponse } from '../lib/apiClient';

export default function CompaniesPage() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');

  const { data: companiesData, isLoading } = useQuery<CompaniesListResponse, Error, CompaniesListResponse>({
    queryKey: ['companies', search, industry, size],
    queryFn: async (): Promise<CompaniesListResponse> => {
      const params: any = { 
        limit: 50,
        page: 1
      };
      
      if (search) params.search = search;
      if (industry) params.industry = industry;
      if (size) params.size = size;
      
      try {
        const response = await apiClient.companies.list(params);
        return response as CompaniesListResponse;
      } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Top Companies
        </h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Explore Rwanda's leading employers and their opportunities
        </p>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-3xl backdrop-blur-xl border shadow-lg mb-8 ${
        theme === 'dark' 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/70 border-white/40'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`rounded-xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white placeholder:text-gray-400' 
                : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
            }`}
          />
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className={`rounded-xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white' 
                : 'bg-white/80 text-gray-900'
            }`}>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Industries</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className={`rounded-xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white' 
                : 'bg-white/80 text-gray-900'
            }`}>
              <SelectValue placeholder="Company Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sizes</SelectItem>
              <SelectItem value="startup">Startup (1-50)</SelectItem>
              <SelectItem value="medium">Medium (51-200)</SelectItem>
              <SelectItem value="large">Large (200+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, index) => (
            <Card key={index} className={`animate-pulse ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-white/40'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                  <div className="flex-1">
                    <div className={`h-5 rounded mb-2 ${
                      theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                    }`} />
                    <div className={`h-4 rounded w-2/3 ${
                      theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                    }`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`h-4 rounded ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                  <div className={`h-4 rounded w-3/4 ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          companiesData?.companies ? companiesData.companies.map((company: any) => (
            <Card key={company.id} className={`group hover:scale-105 transition-all duration-300 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/70 border-white/40 hover:bg-white/90'
            } backdrop-blur-xl shadow-lg hover:shadow-2xl`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-purple-600 to-blue-700' 
                        : 'bg-gradient-to-br from-blue-600 to-purple-700'
                    }`}>
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {company.name}
                        </h3>
                        {company.is_verified && (
                          <Verified className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {company.industry}
                      </p>
                    </div>
                  </div>
                  
                  {company.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {company.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <p className={`text-sm mb-4 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {company.description || 'Leading company in Rwanda with exciting opportunities.'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    {company.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {company.location}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Users className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {company.size || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`${
                    theme === 'dark' 
                      ? 'border-blue-600 text-blue-300' 
                      : 'border-blue-300 text-blue-600'
                  }`}>
                    {company.total_jobs} open positions
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    View Jobs
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : <p className="text-center col-span-3">No companies found</p>
        )}
      </div>
    </div>
  );
}
