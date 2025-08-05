import React from 'react';
import { Filter, X, DollarSign, MapPin, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { useJobFilters } from '../hooks/useJobFilters';

export default function JobFilters() {
  const { theme } = useTheme();
  const { filters, updateFilter, clearFilters } = useJobFilters();

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const categories = ['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Sales'];
  const locations = ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri', 'Nyanza'];
  const companies = ['Bank of Kigali', 'MTN Rwanda', 'Zipline', 'Andela', 'RDB'];

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className={`sticky top-24 ${
      theme === 'dark' 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/70 border-white/40'
    } backdrop-blur-xl shadow-lg`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Job Type */}
        <div>
          <h3 className={`font-medium mb-3 flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Building className="w-4 h-4" />
            <span>Job Type</span>
          </h3>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.job_type === type.toLowerCase()}
                  onCheckedChange={(checked) => 
                    updateFilter('job_type', checked ? type.toLowerCase() : '')
                  }
                />
                <label
                  htmlFor={type}
                  className={`text-sm cursor-pointer ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className={`font-medium mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Category
          </h3>
          <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className={`${
              theme === 'dark' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <h3 className={`font-medium mb-3 flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={filters.location === location}
                  onCheckedChange={(checked) => 
                    updateFilter('location', checked ? location : '')
                  }
                />
                <label
                  htmlFor={location}
                  className={`text-sm cursor-pointer ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Posted */}
        <div>
          <h3 className={`font-medium mb-3 flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>Date Posted</span>
          </h3>
          <Select value={filters.date_range || ''} onValueChange={(value) => updateFilter('date_range', value)}>
            <SelectTrigger className={`${
              theme === 'dark' 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="7">Last week</SelectItem>
              <SelectItem value="30">Last month</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div>
          <h3 className={`font-medium mb-3 flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <DollarSign className="w-4 h-4" />
            <span>Salary Range (RWF)</span>
          </h3>
          <div className="space-y-4">
            <Slider
              defaultValue={[300000, 1500000]}
              max={2000000}
              min={200000}
              step={50000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                200K
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                2M+
              </span>
            </div>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className={`font-medium mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Company
          </h3>
          <div className="space-y-2">
            {companies.map((company) => (
              <div key={company} className="flex items-center space-x-2">
                <Checkbox
                  id={company}
                  checked={filters.source_name === company}
                  onCheckedChange={(checked) => 
                    updateFilter('source_name', checked ? company : '')
                  }
                />
                <label
                  htmlFor={company}
                  className={`text-sm cursor-pointer ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {company}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
