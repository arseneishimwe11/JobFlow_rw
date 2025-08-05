import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { theme } = useTheme();

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-xl ${
          theme === 'dark' 
            ? 'border-white/20 hover:bg-white/10 text-white disabled:opacity-50' 
            : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className={`px-3 py-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              ...
            </span>
          ) : (
            <Button
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => onPageChange(page as number)}
              className={`rounded-xl ${
                currentPage === page
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0'
                  : theme === 'dark'
                    ? 'border-white/20 hover:bg-white/10 text-white'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-xl ${
          theme === 'dark' 
            ? 'border-white/20 hover:bg-white/10 text-white disabled:opacity-50' 
            : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
