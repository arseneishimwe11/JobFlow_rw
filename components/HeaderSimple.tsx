import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Briefcase, Home, Building, Menu, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simplified navigation for production-ready system
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: '1.2k', highlight: true },
    { name: 'Companies', href: '/companies', icon: Building, badge: '300+' },
    { name: 'Admin', href: '/admin', icon: Plus, badge: 'Manage' },
  ];

  return (
    <>
      {/* Premium Glassmorphism Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900/20 backdrop-blur-3xl border-b border-white/5' 
          : 'bg-white/60 backdrop-blur-3xl border-b border-gray-200/30 shadow-sm'
      }`}>
        {/* Glassmorphism overlay */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-900/40 via-slate-900/30 to-gray-900/40' 
            : 'bg-gradient-to-r from-white/60 via-gray-50/40 to-white/60'
        }`} />
        
        {/* Main Header Content */}
        <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="relative transition-all duration-300 group-hover:scale-110">
                <img 
                  src={theme === 'dark' ? '/assets/logo_white.png' : '/assets/logo.png'} 
                  alt="OpenDoors Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold bg-gradient-to-r ${
                  theme === 'dark' 
                    ? 'from-white via-blue-100 to-cyan-100' 
                    : 'from-gray-900 via-blue-900 to-cyan-900'
                } bg-clip-text text-transparent`}>
                  OpenDoors
                </h1>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } -mt-1`}>
                  Find Your Dream Job
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'bg-blue-600/10 text-blue-700 shadow-lg shadow-blue-500/10'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-white/10'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="text-sm">{item.name}</span>
                    
                    {item.badge && (
                      <Badge 
                        variant={item.highlight ? "default" : "secondary"} 
                        className={`ml-1 text-xs px-2 py-0.5 ${
                          item.highlight 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20' 
                            : theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    
                    {isActive && (
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                      }`} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`relative p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-black/5 text-gray-700 hover:text-gray-900'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-black/5 text-gray-700 hover:text-gray-900'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 lg:hidden ${
          theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'
        } backdrop-blur-xl`}>
          <div className="flex flex-col pt-20 px-4 space-y-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-blue-600/10 text-blue-700'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.highlight ? "default" : "secondary"} 
                      className={`ml-auto text-xs ${
                        item.highlight 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                          : theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
