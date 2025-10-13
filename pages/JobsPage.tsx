import React, { useState } from 'react';
import { Menu, X, Filter } from 'lucide-react';
import JobSearch from '../components/JobSearch';
import JobGrid from '../components/JobGrid';
import JobFilters from '../components/JobFilters';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { JobFiltersProvider } from '../contexts/JobFiltersContext';

export default function JobsPage() {
  const { theme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <JobFiltersProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            Browse Jobs
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Discover thousands of job opportunities from Rwanda's top companies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full h-12 flex items-center justify-center space-x-2 rounded-xl transition-all duration-300 ${theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg'
                }`}
            >
              {showFilters ? (
                <>
                  <X className="w-5 h-5" />
                  <span className="font-medium">Hide Filters</span>
                </>
              ) : (
                <>
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Show Filters & Search</span>
                </>
              )}
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'
            }`}>
            <div className="space-y-6">
              {/* Search on mobile (inside filter panel) */}
              <div className="lg:hidden">
                <JobSearch />
              </div>
              <JobFilters />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search on desktop (outside filter panel) */}
            <div className="hidden lg:block">
              <JobSearch />
            </div>
            <JobGrid />
          </div>
        </div>
      </div>
    </JobFiltersProvider>
  );
}
