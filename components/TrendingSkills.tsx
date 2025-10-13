import React from 'react';
import { TrendingUp, Code, BarChart, Palette, Globe, Shield, Database, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '../contexts/ThemeContext';

export default function TrendingSkills() {
  const { theme } = useTheme();

  const skills = [
    { name: 'Senior Operations Consultant', icon: Code, demand: 95, growth: '+28%', jobs: 156 },
    { name: 'Data Analysis', icon: BarChart, demand: 88, growth: '+22%', jobs: 134 },
    { name: 'UI/UX Design', icon: Palette, demand: 82, growth: '+18%', jobs: 98 },
    { name: 'Digital Marketing', icon: Globe, demand: 79, growth: '+15%', jobs: 112 },
    { name: 'Accountant', icon: Database, demand: 86, growth: '+25%', jobs: 89 },
    { name: 'Project Management', icon: TrendingUp, demand: 77, growth: '+12%', jobs: 145 },
  ];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Trending Skills
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Stay ahead of the curve with the most in-demand skills in Rwanda's job market
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <Card key={index} className={`group hover:scale-105 transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
              : 'bg-white/60 border-white/40 hover:bg-white/80'
          } backdrop-blur-xl shadow-lg hover:shadow-2xl`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
                    : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                }`}>
                  <skill.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {skill.name}
                  </h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {skill.jobs} jobs available
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Demand
                  </span>
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {skill.demand}%
                  </span>
                </div>
                
                <Progress 
                  value={skill.demand} 
                  className={`h-2 ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`}
                />

                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    {skill.growth} growth
                  </Badge>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    vs last year
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
