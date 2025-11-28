'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DeltaWave</h1>
              <p className="text-xs text-gray-500">Gerenciador de projetos e tarefas</p>
            </div>
          </div>


          <nav className="flex gap-8">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive('/') || pathname.startsWith('/projects')
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>📁</span>
              <span>Projetos</span>
            </Link>

            <Link
              href="/kanban"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive('/kanban')
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>📊</span>
              <span>Kanban</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
