import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Admin Account',
  description: 'Create a new admin account to manage feedback',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <RegisterForm />
    </main>
  );
}
