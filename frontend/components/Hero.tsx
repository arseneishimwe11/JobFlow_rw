import React, { useState } from 'react';
import { Search, TrendingUp, Users, MapPin, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '../contexts/ThemeContext';

export default function Hero() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '1,247', change: '+12%' },
    { icon: Users, label: 'Companies', value: '342', change: '+8%' },
    { icon: MapPin, label: 'Cities', value: '15', change: '+2%' },
    { icon: TrendingUp, label: 'Placements', value: '2,156', change: '+24%' },
  ];

  const trendingSearches = [
    'Software Developer', 'Marketing Manager', 'Data Analyst', 'Project Manager', 'Sales Executive'
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 text-center max-w-6xl">
        {/* Announcement Badge */}
        <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium mb-8 transition-all duration-300 hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 text-blue-300 border border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200'
        } backdrop-blur-sm shadow-lg`}>
          <Sparkles className="w-4 h-4 mr-2" />
          New: AI-powered job matching now available!
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>

        {/* Main Heading */}
        <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Discover Your
          <span className={`block bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-blue-400 via-cyan-400 to-blue-500' 
              : 'from-blue-600 via-cyan-600 to-blue-700'
          } bg-clip-text text-transparent`}>
            Dream Career
          </span>
          in Rwanda
        </h1>

        <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Connect with Rwanda's top employers and discover opportunities that match your skills, 
          ambitions, and career goals with our intelligent job platform.
        </p>

        {/* Enhanced Search Bar */}
        <div className={`max-w-2xl mx-auto mb-8 p-2 rounded-2xl backdrop-blur-xl border shadow-2xl ${
          theme === 'dark' 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-white/40'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <Input
                placeholder="Search for jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 h-14 text-lg border-0 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-transparent text-white placeholder:text-gray-400' 
                    : 'bg-transparent text-gray-900 placeholder:text-gray-500'
                } focus:ring-0`}
              />
            </div>
            <Button 
              size="lg"
              className={`h-14 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
              } text-white shadow-lg hover:shadow-xl`}
            >
              Search Jobs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Trending Searches */}
        <div className="mb-16">
          <p className={`text-sm mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Trending searches:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                } backdrop-blur-sm`}
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 group ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-white/60 border-white/40 hover:bg-white/80'
              } shadow-lg hover:shadow-2xl`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                  : 'bg-gradient-to-br from-blue-600 to-cyan-600'
              }`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
              <div className="text-xs text-green-500 font-medium">
                {stat.change} this month
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
