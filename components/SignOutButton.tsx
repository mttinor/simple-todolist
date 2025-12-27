'use client';

import { useAuth } from '@/lib/auth-context';

export function SignOutButton() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded bg-white text-secondary border border-gray-200 font-semibold hover:bg-gray-50 hover:text-secondary-hover transition-colors shadow-sm hover:shadow"
      onClick={signOut}
    >
      Sign out
    </button>
  );
}

