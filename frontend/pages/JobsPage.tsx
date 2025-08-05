import React from 'react';
import JobSearch from '../components/JobSearch';
import JobGrid from '../components/JobGrid';
import JobFilters from '../components/JobFilters';
import { useTheme } from '../contexts/ThemeContext';

export default function JobsPage() {
  const { theme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Browse Jobs
        </h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Discover thousands of job opportunities from Rwanda's top companies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <JobFilters />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <JobSearch />
          <JobGrid />
        </div>
      </div>
    </div>
  );
}
