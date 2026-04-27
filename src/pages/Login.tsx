import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const isAuthenticated = !!localStorage.getItem('token');

  // Load remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const formatName = (email: string) => {
    const name = email.split('@')[0] || 'User';
    return name
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const createOrUpdateProfile = async (userData: { name: string; email: string; logo?: string }) => {
    try {
      const body: any = {
        name: userData.name,
        email: userData.email
      };
      if (userData.logo) {
        body.logo = userData.logo;
      }
      await apiFetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    } catch (error) {
      console.warn('Profile sync failed', error);
    }
  };

  const handleAuthSuccess = async (user: any) => {
    const token = await user.getIdToken();
    localStorage.setItem('token', token);
    
    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', user.email || email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    const profileName = user.displayName || formatName(user.email || email);
    const profileEmail = user.email || email;
    const profileLogo = user.photoURL || '';

    let profileData: any = null;
    try {
      const profileRes = await apiFetch('/api/profile');
      if (profileRes.ok) {
        profileData = await profileRes.json();
      }
    } catch (error) {
      console.warn('Profile load failed', error);
    }

    if (profileData) {
      login({
        email: profileEmail,
        name: profileData.name || profileName,
        photoURL: profileData.logo || profileLogo,
        phone: profileData.phone || '',
        location: profileData.address || ''
      });
    } else {
      await createOrUpdateProfile({
        name: profileName,
        email: profileEmail,
        logo: profileLogo
      });
      login({
        email: profileEmail,
        name: profileName,
        photoURL: profileLogo,
        phone: '',
        location: ''
      });
    }

    toast.success('Authentication successful');
    navigate('/dashboard');
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
      setMode('login');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSuccess(userCredential.user);
    } catch (error: any) {
      console.error(error);
      toast.error('Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 AUTH HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'reset') {
      await handleResetPassword();
      return;
    }

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);

      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential.user);
      }
    } catch (error: any) {
      console.error(error);
      if (mode === 'login') {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md glass-card border-none shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl">
              <FileText className="text-white w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">BillingPro</CardTitle>
          <CardDescription>
            {mode === 'login' && 'Enter your credentials to access your dashboard'}
            {mode === 'register' && 'Create a new account to start billing'}
            {mode === 'reset' && 'Enter your email to reset your password'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-800"
                  onClick={() => setMode('reset')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {mode !== 'reset' && (
              <Button type="button" variant="secondary" className="w-full gap-2" onClick={handleGoogleSignIn} disabled={isLoading}>
                <LogIn className="w-4 h-4" />
                Sign in with Google
              </Button>
            )}

          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register' : 'Reset Password'}
            </Button>

            {mode === 'login' && (
              <div className="text-center text-sm text-slate-500">
                New here?{' '}
                <button type="button" className="text-indigo-600 hover:text-indigo-800" onClick={() => setMode('register')}>
                  Create account
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button type="button" className="text-indigo-600 hover:text-indigo-800" onClick={() => setMode('login')}>
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="text-center text-sm text-slate-500">
                Remembered it?{' '}
                <button type="button" className="text-indigo-600 hover:text-indigo-800" onClick={() => setMode('login')}>
                  Back to sign in
                </button>
              </div>
            )}
          </CardFooter>
        </form>

      </Card>
    </div>
  );
}