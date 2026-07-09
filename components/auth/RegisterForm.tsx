'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/useAuth';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData.email, formData.password, formData.fullName);

      if (!result.success) {
        setError('Registration failed. Email may already be in use.');
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
        <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
        <p className="text-muted-foreground">Join as an admin to manage feedback</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
          Full Name
        </label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          required
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="John Doe"
          disabled={isLoading}
        />
      </div>

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
          minLength={8}
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
