import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Briefcase, Bell, User, Settings, Home, Building, Heart, Menu, X, ChevronDown, Plus, LogOut, Shield, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AdminJobForm from './admin/AdminJobForm';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminFormOpen, setAdminFormOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: '1.2k', highlight: true },
    { name: 'Companies', href: '/companies', icon: Building, badge: '300+' },
    { name: 'Saved', href: '/saved', icon: Heart, badge: '12' },
    // { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: 'New' }, // Commented out for now
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
            {/* Logo Section - Premium & Compact */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className={`relative p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 shadow-lg shadow-blue-500/20' 
                  : 'bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 shadow-lg shadow-blue-500/20'
              }`}>
                <Briefcase className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Akazi Rwanda
                </h1>
                <p className={`text-xs font-medium leading-none ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  Premium Job Platform
                </p>
              </div>
            </Link>

            {/* Enhanced Navigation - Centered */}
            <nav className="hidden lg:flex items-center">
              <div className={`flex items-center p-1 rounded-xl transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-white/5 backdrop-blur-sm border border-white/10' 
                  : 'bg-white/70 backdrop-blur-sm border border-gray-200/40 shadow-sm'
              }`}>
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative flex items-center space-x-2 px-3 py-2 mx-[2px] rounded-lg transition-all duration-300 group ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'text-gray-800 hover:bg-white/80 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? 'text-white' : ''
                      } ${item.highlight && !isActive ? 'text-blue-500' : ''}`} />
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className={`text-xs h-5 ${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : theme === 'dark'
                              ? 'border-blue-500 text-blue-300 bg-blue-900/20'
                              : 'border-blue-400 text-blue-600 bg-blue-100/60'
                        } ${item.highlight ? 'animate-pulse' : ''}`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Actions - Optimized & Premium */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Hidden Admin Access - Double click to reveal */}
              {isAdmin && (
                <Button 
                  onClick={() => setAdminFormOpen(true)}
                  className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                  }`}>
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:block">Post Job</span>
                </Button>
              )}
              
              {/* Hidden Admin Login - Triple click on logo to reveal */}

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className={`relative w-9 h-9 rounded-lg transition-all duration-300 hover:scale-110 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-white/70 text-gray-800 hover:text-gray-900 shadow-sm'
                }`}
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75" />
              </Button>

              {/* Admin Post Job Button */}
              {isAdmin && (
                <Button
                  onClick={() => setAdminFormOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              )}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-white/70 text-gray-800 hover:text-gray-900 shadow-sm'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 transition-transform duration-500" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform duration-500" />
                )}
              </Button>

              {/* User Profile & Actions */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`relative p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                        theme === 'dark' 
                          ? 'hover:bg-white/10 text-white' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className={`w-80 p-0 ${
                      theme === 'dark' 
                        ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl' 
                        : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
                    }`}
                  >
                    {/* User Info Header */}
                    <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold truncate ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user?.name || 'Guest User'}
                          </div>
                          <div className={`text-sm truncate ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {user?.email || 'Not signed in'}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {user?.isPro && (
                              <Badge className={`text-xs h-5 ${
                                theme === 'dark' ? 'bg-green-900/40 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700'
                              }`}>Pro</Badge>
                            )}
                            {user?.isVerified && (
                              <Badge className={`text-xs h-5 ${
                                theme === 'dark' ? 'bg-blue-900/40 text-blue-400 border border-blue-700/50' : 'bg-blue-100 text-blue-700'
                              }`}>Verified</Badge>
                            )}
                            {isAdmin && (
                              <Badge className={`text-xs h-5 ${
                                theme === 'dark' ? 'bg-purple-900/40 text-purple-400 border border-purple-700/50' : 'bg-purple-100 text-purple-700'
                              }`}>Admin</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                          <User className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/saved" className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                          <Heart className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span>Saved Jobs</span>
                          <Badge className={`ml-auto text-xs h-5 ${theme === 'dark' ? 'bg-blue-900/40 text-blue-400 border border-blue-700/50' : 'bg-blue-100 text-blue-700'}`}>12</Badge>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/20' : 'text-purple-700 hover:text-purple-800 hover:bg-purple-50'}`}>
                            <UserCog className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                        <Settings className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className={`my-1 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200'}`} />
                    
                    <div className="p-2">
                      <DropdownMenuItem 
                        onClick={logout}
                        className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 cursor-pointer ${theme === 'dark' ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* Login Button */
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-9 h-9 rounded-lg transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
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
          <div className={`absolute top-16 left-4 right-4 rounded-2xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/95 border border-gray-700/50' 
              : 'bg-white/95 border border-gray-200/20'
          } backdrop-blur-xl shadow-2xl`}>
            <div className="p-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-1 mb-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100/60 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${
                          isActive ? 'text-white' : ''
                        }`} />
                        <span className="font-medium text-base">{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className={`text-xs h-5 ${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : theme === 'dark'
                              ? 'border-blue-600 text-blue-300 bg-blue-900/20'
                              : 'border-blue-400 text-blue-600 bg-blue-100/60'
                        }`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <Button className={`w-full mb-4 h-11 rounded-xl font-medium ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
              } text-white shadow-lg`}>
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Button>

              {/* Mobile User Section */}
              <div className={`pt-4 border-t ${
                theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                  }`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      John Doe
                    </div>
                    <div className={`text-sm truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Software Engineer
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-lg ${
                      theme === 'dark' 
                        ? 'border-gray-700/50 text-gray-300 hover:text-white hover:bg-white/10' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    <span className="text-xs">Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-lg ${
                      theme === 'dark'
                        ? 'text-red-400 hover:text-red-300 border-red-900/50 hover:bg-red-900/20'
                        : 'text-red-600 border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    <span className="text-xs">Sign out</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
      
      {/* Admin Job Form Modal */}
      <AdminJobForm 
        open={adminFormOpen}
        onOpenChange={setAdminFormOpen}
      />
    </>
  );
}
