import React from 'react';
import { Code, TrendingUp, Heart, GraduationCap, Briefcase, Wrench, Palette, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';

export default function JobCategories() {
  const { theme } = useTheme();

  const categories = [
    { name: 'Technology', icon: Code, count: 342, color: 'from-blue-500 to-cyan-500', growth: '+15%' },
    { name: 'Marketing', icon: TrendingUp, count: 156, color: 'from-purple-500 to-pink-500', growth: '+8%' },
    { name: 'Healthcare', icon: Heart, count: 89, color: 'from-red-500 to-rose-500', growth: '+12%' },
    { name: 'Education', icon: GraduationCap, count: 67, color: 'from-green-500 to-emerald-500', growth: '+5%' },
    { name: 'Business', icon: Briefcase, count: 234, color: 'from-orange-500 to-amber-500', growth: '+10%' },
    { name: 'Engineering', icon: Wrench, count: 123, color: 'from-gray-500 to-slate-500', growth: '+7%' },
    { name: 'Design', icon: Palette, count: 78, color: 'from-pink-500 to-purple-500', growth: '+18%' },
    { name: 'Remote', icon: Globe, count: 445, color: 'from-indigo-500 to-blue-500', growth: '+25%' },
  ];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Browse by Category
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Explore opportunities across different industries and find the perfect match for your skills
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className={`group hover:scale-105 transition-all duration-300 cursor-pointer ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
              : 'bg-white/60 border-white/40 hover:bg-white/80'
          } backdrop-blur-xl shadow-lg hover:shadow-2xl`}>
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {category.name}
              </h3>
              
              {/* <p className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {category.count}
              </p>
              
              <p className={`text-sm mb-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                open positions
              </p> */}

              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                {category.growth} growth
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
