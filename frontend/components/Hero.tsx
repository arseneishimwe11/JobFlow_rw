import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Users, MapPin, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '../contexts/ThemeContext';
import jobOffersSvg from '@/assets/job_offers.svg';

export default function Hero() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Typewriter effect states
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const typingSpeed = useRef(120); // Typing speed in ms
  const deletingSpeed = useRef(60); // Deleting speed in ms
  const pauseDuration = useRef(2000); // Pause duration in ms

  const dynamicWords = [
    'DREAM CAREER',
    'PERFECT JOB',
    'IDEAL POSITION',
    'FUTURE ROLE',
    'NEXT OPPORTUNITY',
    'GROWTH PATH',
    'SUCCESS STORY'
  ];

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '1,247', change: '+12%' },
    { icon: Users, label: 'Companies', value: '342', change: '+8%' },
    { icon: MapPin, label: 'Cities', value: '15', change: '+2%' },
    { icon: TrendingUp, label: 'Placements', value: '2,156', change: '+24%' },
  ];

  const trendingSearches = [
    'Software Developer', 'Marketing Manager', 'Data Analyst', 'Project Manager', 'Sales Executive'
  ];

  // Typewriter effect
  useEffect(() => {
    const currentWord = dynamicWords[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      // Pause at the end of the word before deleting
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration.current);
    } else if (isDeleting) {
      // Handle deletion of characters
      if (currentText === '') {
        // When fully deleted, move to the next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
      } else {
        // Delete one character at a time
        timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }, deletingSpeed.current);
      }
    } else {
      // Handle typing of characters
      if (currentText === currentWord) {
        // When word is fully typed, pause
        setIsPaused(true);
      } else {
        // Type one character at a time
        timeout = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, typingSpeed.current);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentWordIndex, dynamicWords]);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">      
      {/* SVG Background Element - Positioned for visual appeal */}
      <div className="absolute right-0 left-[-25px] top-1/2 transform -translate-y-1/2 w-1/2 h-full opacity-20 pointer-events-none hidden lg:block">
        <img 
          src={jobOffersSvg} 
          alt="Job offers illustration" 
          className="w-full h-full object-contain animate-float"
        />
      </div>
      

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          .animate-blink {
            animation: blink 1s infinite;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .typewriter-text {
            background: linear-gradient(to right, #2563eb, #06b6d4, #2563eb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
          }
          
          .dark .typewriter-text {
            background: linear-gradient(to right, #60a5fa, #22d3ee, #60a5fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
          }
        `
      }} />
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-6xl relative z-10">
        {/* Mobile SVG Element - Shown only on smaller screens */}
        <div className="mx-auto w-full max-w-xs mb-8 lg:hidden">
          <img 
            src={jobOffersSvg} 
            alt="Job offers illustration" 
            className={`w-full h-auto object-contain transition-all duration-500 hover:scale-105 animate-float ${theme === 'dark' ? 'opacity-70' : 'opacity-90'}`}
          />
        </div>
        {/* Announcement Badge */}
        <div className={`inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 transition-all duration-300 hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 text-blue-300 border border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200'
        } backdrop-blur-sm shadow-lg`}>
          <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
          <span className="hidden xs:inline">New: Smart job recommendations available!</span>
          <span className="xs:hidden">Smart job matching!</span>
          <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2" />
        </div>

        {/* Main Heading with Typewriter Effect */}
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 rowdies-regular leading-tight ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Discover your
          <span className="block relative">
            <span className="relative inline-block">
              <span className="typewriter-text">
                {currentText}
              </span>
              <span 
                className="inline-block animate-blink"
                style={{
                  color: theme === 'dark' ? '#60a5fa' : '#2563eb',
                  fontWeight: 'bold',
                  marginLeft: '2px',
                  position: 'relative',
                  top: '-5px'
                }}
              >|</span>
            </span>
          </span>
          <span className="hidden sm:inline">in Rwanda</span>
          <span className="sm:hidden">in Rwanda</span>
        </h1>

        <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto roboto-slab-normal leading-relaxed ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Connect with Rwanda's top employers and discover opportunities that match your skills, 
          ambitions, and career goals with our intelligent job platform.
        </p>

        {/* Enhanced Search Bar */}
        <div className={`max-w-2xl mx-auto mb-6 sm:mb-8 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl backdrop-blur-xl border shadow-2xl ${
          theme === 'dark' 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-white/40'
        }`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
            <div className="relative flex-1">
              <Search className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <Input
                placeholder="Search for jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-lg border-0 rounded-lg sm:rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-transparent text-white placeholder:text-gray-400' 
                    : 'bg-transparent text-gray-900 placeholder:text-gray-500'
                } focus:ring-0`}
              />
            </div>
            <Button 
              size="lg"
              className={`h-12 sm:h-14 px-6 sm:px-8 rounded-lg sm:rounded-xl font-medium sm:font-semibold transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
              } text-white shadow-lg hover:shadow-xl`}
            >
              <span className="hidden sm:inline">Search Jobs</span>
              <span className="sm:hidden">Search</span>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-1 sm:ml-2" />
            </Button>
          </div>
        </div>

        {/* Trending Searches */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Trending searches:
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 ${
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 group ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-white/60 border-white/40 hover:bg-white/80'
              } shadow-lg hover:shadow-2xl`}
            >
              <div className={`w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                  : 'bg-gradient-to-br from-blue-600 to-cyan-600'
              }`}>
                <stat.icon className="w-5 sm:w-5.5 lg:w-6 h-5 sm:h-5.5 lg:h-6 text-white" />
              </div>
              <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-xs sm:text-sm mb-1 sm:mb-2 ${
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
