import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface LoginDialogProps {
  children: React.ReactNode;
}

export default function LoginDialog({ children }: LoginDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      setOpen(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl' 
          : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
      }`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Lock className="w-5 h-5" />
            <span>Admin Login</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Email
            </Label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@akazi.rw"
                required
                disabled={isLoading}
                className={`pl-10 rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Password
            </Label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                disabled={isLoading}
                className={`pl-10 rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                }`}
              />
            </div>
          </div>

          {error && (
            <Alert className={`${
              theme === 'dark' 
                ? 'bg-red-900/20 border-red-800 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-sm text-blue-700">
              <strong>Demo credentials:</strong><br />
              Email: admin@akazi.rw<br />
              Password: admin123
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className={`w-full rounded-xl ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
            } text-white font-medium`}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}