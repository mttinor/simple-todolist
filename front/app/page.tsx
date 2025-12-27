'use client';

import { SignInForm } from '@/components/SignInForm';
import { SignOutButton } from '@/components/SignOutButton';
import { TodoDashboard } from '@/components/TodoDashboard';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function Content() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {user ? (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600">Manage your daily and weekly tasks</p>
          </div>
          <TodoDashboard />
        </>
      ) : (
        <div className="max-w-md mx-auto mt-20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Todo Dashboard</h1>
            <p className="text-xl text-gray-600">Sign in to manage your tasks</p>
          </div>
          <SignInForm />
        </div>
      )}
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">Todo Dashboard</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">
        <Content />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

