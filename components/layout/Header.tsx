'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-zinc-950/90 border-b border-zinc-800/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left side: hamburger + logo */}
      <div className="flex items-center gap-2 md:gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all md:hidden"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link href="/dashboard" className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.3)]">
            <span className="text-lg">💪</span>
          </div>
          <span className="text-lg font-black text-white">
            GymFit <span className="text-red-500">Pro</span>
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-white leading-tight">{session?.user?.name}</p>
          <p className="text-xs text-zinc-500">{session?.user?.email}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-sm font-bold text-white">
          {session?.user?.name?.charAt(0) || 'U'}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <span>⏻</span>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
