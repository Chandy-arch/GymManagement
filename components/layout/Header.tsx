'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-zinc-950/90 border-b border-zinc-800/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.3)]">
          <span className="text-lg">💪</span>
        </div>
        <span className="text-lg font-black text-white">
          GymFit <span className="text-red-500">Pro</span>
        </span>
      </Link>

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
