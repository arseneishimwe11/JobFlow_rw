import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Briefcase, Search, Bell, User, Settings, Home, Building, Heart, BarChart3, Menu, X, ChevronDown, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: '1.2k', highlight: true },
    { name: 'Companies', href: '/companies', icon: Building, badge: '300+' },
    { name: 'Saved', href: '/saved', icon: Heart, badge: '12' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: 'New' },
  ];

  return (
    <>
      {/* Premium Glassmorphism Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900/20 backdrop-blur-3xl border-b border-white/5' 
          : 'bg-white/20 backdrop-blur-3xl border-b border-gray-200/20'
      }`}>
        {/* Glassmorphism overlay */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-900/40 via-slate-900/30 to-gray-900/40' 
            : 'bg-gradient-to-r from-white/40 via-blue-50/30 to-white/40'
        }`} />
        
        {/* Main Header Content */}
        <div className="relative container mx-auto px-6 max-w-7xl">
          <div className="flex items-center h-20">
            {/* Logo Section - Optimized */}
            <div className="flex items-center space-x-4 mr-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className={`relative p-2.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 shadow-lg shadow-blue-500/25' 
                    : 'bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 shadow-lg shadow-blue-500/25'
                }`}>
                  <Briefcase className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-xl font-bold transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Akazi Rwanda
                  </h1>
                  <p className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Premium Job Platform
                  </p>
                </div>
              </Link>
            </div>

            {/* Enhanced Navigation - Better Space Usage */}
            <nav className="hidden lg:flex items-center space-x-1 mr-8">
              <div className={`flex items-center p-1.5 rounded-2xl transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10' 
                  : 'bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/50'
              }`}>
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'text-gray-700 hover:bg-white/40 hover:text-gray-900'
                      }`}
                    >
                      {/* Glow effect for active item */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-sm" />
                      )}
                      
                      <item.icon className={`w-4 h-4 transition-all duration-300 relative z-10 ${
                        isActive ? 'text-white' : ''
                      } ${item.highlight && !isActive ? 'text-blue-500' : ''}`} />
                      <span className="font-semibold text-sm relative z-10">{item.name}</span>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className={`text-xs relative z-10 ${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : theme === 'dark'
                              ? 'border-blue-500 text-blue-300 bg-blue-900/30'
                              : 'border-blue-400 text-blue-600 bg-blue-100/50'
                        } ${item.highlight ? 'animate-pulse' : ''}`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Premium Search Bar - Centered and Enhanced */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className={`relative w-full group transition-all duration-300 ${
                searchFocused ? 'scale-105' : ''
              }`}>
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20' 
                    : 'bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-xl border border-white/30'
                } ${searchFocused ? 'shadow-2xl shadow-blue-500/20' : 'shadow-lg'}`} />
                
                <div className="relative flex items-center">
                  <Search className={`absolute left-4 w-5 h-5 transition-all duration-300 ${
                    theme === 'dark' 
                      ? searchFocused ? 'text-blue-400' : 'text-gray-400'
                      : searchFocused ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <Input
                    placeholder="Search jobs, companies, skills..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`pl-12 pr-12 h-12 border-0 rounded-2xl bg-transparent transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50' 
                        : 'text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50'
                    }`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-2 w-8 h-8 rounded-lg transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'hover:bg-white/10 text-gray-400 hover:text-blue-400' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Actions - Optimized Layout */}
            <div className="flex items-center space-x-2">
              {/* Post Job Button - Premium CTA */}
              <Button className={`hidden lg:flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25'
              }`}>
                <Plus className="w-4 h-4" />
                <span>Post Job</span>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className={`relative w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-white/40 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full animate-ping opacity-75" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-xl transition-all duration-500 hover:scale-110 hover:rotate-180 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-white/40 text-gray-700 hover:text-gray-900'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 transition-transform duration-500" />
                ) : (
                  <Moon className="w-5 h-5 transition-transform duration-500" />
                )}
              </Button>

              {/* Premium User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                      theme === 'dark' 
                        ? 'hover:bg-white/10 text-gray-300' 
                        : 'hover:bg-white/40 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                          : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}>
                        <User className="w-4 h-4 text-white" />
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="hidden xl:block text-left">
                        <div className="font-semibold text-sm">John Doe</div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Software Engineer
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-72 mt-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-2xl' 
                    : 'bg-white/95 border-gray-200/50 backdrop-blur-2xl'
                } shadow-2xl rounded-2xl`}>
                  {/* User Profile Header */}
                  <div className={`p-4 border-b ${
                    theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                          : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}>
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          John Doe
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          john.doe@example.com
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-green-100 text-green-700 text-xs">Pro Member</Badge>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">Verified</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-105">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/saved" className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-105">
                        <Heart className="w-4 h-4" />
                        <span>Saved Jobs</span>
                        <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">12</Badge>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-105">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="my-2" />
                  
                  <div className="p-2">
                    <DropdownMenuItem className="text-red-600 p-3 rounded-xl transition-all duration-200 hover:scale-105">
                      Sign out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-10 h-10 rounded-xl transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300' 
                    : 'hover:bg-white/40 text-gray-700'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 lg:hidden`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className={`absolute top-20 left-4 right-4 rounded-3xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/95 border border-white/10' 
              : 'bg-white/95 border border-gray-200/20'
          } backdrop-blur-2xl shadow-2xl`}>
            <div className="p-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className={`relative ${
                  theme === 'dark' 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-gray-100 border border-gray-200'
                } rounded-2xl`}>
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    placeholder="Search jobs, companies..."
                    className={`pl-12 h-12 border-0 rounded-2xl bg-transparent ${
                      theme === 'dark' 
                        ? 'text-white placeholder:text-gray-400' 
                        : 'text-gray-900 placeholder:text-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <item.icon className={`w-6 h-6 ${
                          isActive ? 'text-white' : ''
                        }`} />
                        <span className="font-semibold text-lg">{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className={`${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : theme === 'dark'
                              ? 'border-blue-600 text-blue-300 bg-blue-900/30'
                              : 'border-blue-400 text-blue-600 bg-blue-100/50'
                        }`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <Button className={`w-full mb-4 h-12 rounded-2xl font-semibold ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
              } text-white shadow-lg`}>
                <Plus className="w-5 h-5 mr-2" />
                Post a Job
              </Button>

              {/* Mobile User Section */}
              <div className={`pt-4 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                  }`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      John Doe
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Software Engineer
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className={`rounded-xl ${
                      theme === 'dark' 
                        ? 'border-white/20 text-white hover:bg-white/10' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
