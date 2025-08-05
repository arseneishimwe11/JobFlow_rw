import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`border-t backdrop-blur-xl ${
      theme === 'dark' 
        ? 'border-white/10 bg-slate-900/80' 
        : 'border-gray-200 bg-white/80'
    }`}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Rwanda Jobs
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Connecting talented professionals with amazing opportunities across Rwanda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className={`${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className={`${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}>
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div className="space-y-4">
            <h4 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              For Job Seekers
            </h4>
            <ul className="space-y-2">
              {['Browse Jobs', 'Career Advice', 'Resume Builder', 'Salary Guide'].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div className="space-y-4">
            <h4 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              For Employers
            </h4>
            <ul className="space-y-2">
              {['Post a Job', 'Pricing', 'Talent Search', 'Company Profiles'].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Support
            </h4>
            <ul className="space-y-2">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          <p className={`text-sm flex items-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for Rwanda
          </p>
          <p className={`text-sm mt-4 md:mt-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2024 Rwanda Jobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
