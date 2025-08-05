import React, { useState } from 'react';
import { Search, MapPin, Filter, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { useJobFilters } from '../hooks/useJobFilters';

export default function JobSearch() {
  const { theme } = useTheme();
  const { filters, updateFilter, clearFilters } = useJobFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className={`p-6 rounded-3xl backdrop-blur-xl border shadow-2xl mb-8 ${
      theme === 'dark' 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/70 border-white/40'
    }`}>
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <Input
            placeholder="Search jobs, companies, or keywords..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className={`pl-12 h-14 text-lg rounded-2xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white placeholder:text-gray-400' 
                : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
            } backdrop-blur-sm`}
          />
        </div>

        <div className="relative md:w-64">
          <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <Input
            placeholder="Location"
            value={filters.location || ''}
            onChange={(e) => updateFilter('location', e.target.value)}
            className={`pl-12 h-14 rounded-2xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white placeholder:text-gray-400' 
                : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
            } backdrop-blur-sm`}
          />
        </div>

        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
          className={`h-14 px-6 rounded-2xl border-0 ${
            theme === 'dark' 
              ? 'bg-white/10 hover:bg-white/20 text-white' 
              : 'bg-white/80 hover:bg-white text-gray-900'
          } backdrop-blur-sm transition-all duration-300`}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className={`h-12 rounded-xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white' 
                : 'bg-white/80 text-gray-900'
            } backdrop-blur-sm`}>
              <Briefcase className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.job_type || ''} onValueChange={(value) => updateFilter('job_type', value)}>
            <SelectTrigger className={`h-12 rounded-xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white' 
                : 'bg-white/80 text-gray-900'
            } backdrop-blur-sm`}>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.date_range || ''} onValueChange={(value) => updateFilter('date_range', value)}>
            <SelectTrigger className={`h-12 rounded-xl border-0 ${
              theme === 'dark' 
                ? 'bg-white/10 text-white' 
                : 'bg-white/80 text-gray-900'
            } backdrop-blur-sm`}>
              <SelectValue placeholder="Date Posted" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="7">Last week</SelectItem>
              <SelectItem value="30">Last month</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>

          <div className="md:col-span-3 flex justify-end">
            <Button
              onClick={clearFilters}
              variant="ghost"
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Clear all filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
