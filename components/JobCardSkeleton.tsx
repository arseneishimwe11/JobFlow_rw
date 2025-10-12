import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function JobCardSkeleton() {
  const { theme } = useTheme();

  return (
    <div className={`p-6 rounded-3xl backdrop-blur-xl border animate-pulse ${
      theme === 'dark' 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/70 border-white/40'
    } shadow-lg`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={`h-5 rounded mb-2 ${
            theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
          }`} style={{ width: '80%' }} />
          <div className={`h-4 rounded ${
            theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
          }`} style={{ width: '60%' }} />
        </div>
        <div className={`w-8 h-8 rounded-full ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} />
      </div>

      {/* Location and Date */}
      <div className="flex items-center justify-between mb-4">
        <div className={`h-4 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '40%' }} />
        <div className={`h-4 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '30%' }} />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className={`h-4 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} />
        <div className={`h-4 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '90%' }} />
        <div className={`h-4 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '70%' }} />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className={`h-6 rounded-full ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '60px' }} />
        <div className={`h-6 rounded-full ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '80px' }} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={`h-3 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '50px' }} />
        <div className={`h-8 rounded ${
          theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
        }`} style={{ width: '100px' }} />
      </div>
    </div>
  );
}
