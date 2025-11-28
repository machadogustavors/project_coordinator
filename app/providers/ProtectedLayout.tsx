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
    // Se estiver na página de login, não faz nada
    if (pathname === '/login') {
      return;
    }

    // Se não está autenticado, redireciona para login
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, pathname, router]);

  // Se estiver na página de login, retorna as crianças sem o header
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Se está carregando, mostra um loader
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

  // Se está autenticado e não é página de login, retorna com header
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
