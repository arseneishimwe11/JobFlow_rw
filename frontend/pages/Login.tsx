import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, LogIn, AlertCircle, Briefcase } from 'lucide-react';

export default function Login() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@akazi.rw',
      password: 'admin123',
    });
    setError('');
  };

  const fillUserCredentials = () => {
    setFormData({
      email: 'user@example.com',
      password: 'password123',
    });
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-600 to-cyan-700' 
              : 'bg-gradient-to-br from-blue-600 to-cyan-600'
          }`}>
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            JobFlow
          </h1>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your gateway to career opportunities
          </p>
        </div>

        <Card className={`${
          theme === 'dark' 
            ? 'bg-white/10 border-white/20 backdrop-blur-xl' 
            : 'bg-white/80 border-white/40 backdrop-blur-xl shadow-xl'
        }`}>
          <CardHeader className="space-y-1">
            <CardTitle className={`text-2xl text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Sign In
            </CardTitle>
            <CardDescription className={`text-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={`rounded-xl border-0 ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-white placeholder:text-gray-400' 
                      : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    required
                    className={`rounded-xl border-0 pr-10 ${
                      theme === 'dark' 
                        ? 'bg-white/10 text-white placeholder:text-gray-400' 
                        : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="space-y-3 pt-4 border-t border-white/20">
              <p className={`text-sm text-center ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillAdminCredentials}
                  className={`text-xs ${
                    theme === 'dark' 
                      ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Admin Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillUserCredentials}
                  className={`text-xs ${
                    theme === 'dark' 
                      ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  User Login
                </Button>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link 
            to="/" 
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
