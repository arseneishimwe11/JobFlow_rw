import React from 'react';
import { User, Mail, MapPin, Briefcase, Star, Edit, Camera, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfilePage() {
  const { theme } = useTheme();

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'Kigali, Rwanda',
    title: 'Senior Software Engineer',
    bio: 'Passionate software engineer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies.',
    avatar: null,
    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'Python', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Docker', level: 80 },
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Andela Rwanda',
        period: '2022 - Present',
        description: 'Leading development of web applications using React and Node.js',
      },
      {
        title: 'Software Engineer',
        company: 'Tech Solutions Ltd',
        period: '2020 - 2022',
        description: 'Developed and maintained multiple client projects',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Computer Science',
        school: 'University of Rwanda',
        period: '2016 - 2020',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className={`${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl shadow-lg`}>
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-700' 
                    : 'bg-gradient-to-br from-blue-600 to-purple-700'
                }`}>
                  <User className="w-12 h-12 text-white" />
                </div>
                <Button
                  size="icon"
                  className={`absolute bottom-0 right-1/2 transform translate-x-8 w-8 h-8 rounded-full ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <h2 className={`text-xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {user.name}
              </h2>
              
              <p className={`text-sm mb-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user.title}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {user.location}
                  </span>
                </div>
              </div>
              
              <Button className={`w-full mb-3 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } text-white`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button variant="outline" className={`w-full ${
                theme === 'dark' 
                  ? 'border-white/20 text-white hover:bg-white/10' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className={`${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl shadow-lg`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Star className="w-5 h-5" />
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {skill.name}
                    </span>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {skill.level}%
                    </span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className={`${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl shadow-lg`}>
            <CardHeader>
              <CardTitle className={`${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {user.bio}
              </p>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className={`${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl shadow-lg`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Briefcase className="w-5 h-5" />
                <span>Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.experience.map((exp, index) => (
                <div key={index} className="relative">
                  {index !== user.experience.length - 1 && (
                    <div className={`absolute left-6 top-12 w-px h-16 ${
                      theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                    }`} />
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-purple-600 to-blue-700' 
                        : 'bg-gradient-to-br from-blue-600 to-purple-700'
                    }`}>
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {exp.title}
                      </h3>
                      <p className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {exp.company}
                      </p>
                      <Badge variant="outline" className={`mb-2 ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-400' 
                          : 'border-gray-300 text-gray-600'
                      }`}>
                        {exp.period}
                      </Badge>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className={`${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-white/40'
          } backdrop-blur-xl shadow-lg`}>
            <CardHeader>
              <CardTitle className={`${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.education.map((edu, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
                      : 'bg-gradient-to-br from-green-600 to-emerald-700'
                  }`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {edu.degree}
                    </h3>
                    <p className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {edu.school}
                    </p>
                    <Badge variant="outline" className={`${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-400' 
                        : 'border-gray-300 text-gray-600'
                    }`}>
                      {edu.period}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
