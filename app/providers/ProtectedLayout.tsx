'use client';

import { Header } from '@/app/components/Header';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export function ProtectedLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/login') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  return null;
}
