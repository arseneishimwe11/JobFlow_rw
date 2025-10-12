import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Briefcase, Building, Heart, User, BarChart3, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home, badge: null },
    { name: 'Browse Jobs', href: '/jobs', icon: Briefcase, badge: '1.2k' },
    { name: 'Companies', href: '/companies', icon: Building, badge: '300+' },
    { name: 'Saved Jobs', href: '/saved', icon: Heart, badge: '12' },
    { name: 'Profile', href: '/profile', icon: User, badge: null },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: 'New' },
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 transform transition-all duration-300 lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-blue-800/30' 
          : 'bg-gradient-to-b from-blue-50 via-sky-50 to-blue-100 border-blue-200/50'
      } border-r backdrop-blur-xl shadow-2xl`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-blue-800/30' : 'border-blue-200/50'
          }`}>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-blue-100' : 'text-blue-900'
            }`}>
              Navigation
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`lg:hidden rounded-xl ${
                theme === 'dark' 
                  ? 'hover:bg-blue-800/30 text-blue-300 hover:text-blue-100' 
                  : 'hover:bg-blue-200/50 text-blue-700 hover:text-blue-900'
              }`}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/25'
                      : theme === 'dark'
                        ? 'text-blue-200 hover:bg-blue-800/30 hover:text-blue-100'
                        : 'text-blue-700 hover:bg-blue-200/50 hover:text-blue-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : ''
                    }`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={isActive ? "secondary" : "outline"} className={`text-xs ${
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
          </nav>

          {/* Secondary Navigation */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-blue-800/30' : 'border-blue-200/50'
          }`}>
            <div className="space-y-2">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'text-blue-300 hover:bg-blue-800/30 hover:text-blue-100'
                      : 'text-blue-600 hover:bg-blue-200/50 hover:text-blue-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-blue-800/30' : 'border-blue-200/50'
          }`}>
            <div className={`p-4 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/20' 
                : 'bg-gradient-to-br from-blue-100/80 to-sky-100/80 border border-blue-300/30'
            } backdrop-blur-sm`}>
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-blue-100' : 'text-blue-900'
              }`}>
                Job Alerts
              </h3>
              <p className={`text-sm mb-3 ${
                theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
              }`}>
                Get notified about new jobs matching your preferences.
              </p>
              <Button size="sm" className={`w-full ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 shadow-lg shadow-blue-500/25'
              } text-white border-0 transition-all duration-300 hover:scale-105`}>
                Set Up Alerts
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
