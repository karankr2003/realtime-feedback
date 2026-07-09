import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Admin Login',
  description: 'Sign in to the feedback management dashboard',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <LoginForm />
    </main>
  );
}
