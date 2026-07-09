'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/useAuth';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Admin Login</h1>
        <p className="text-muted-foreground">Sign in to access the feedback dashboard</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="admin@example.com"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
}
