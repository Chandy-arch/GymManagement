'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import TrainerSidebar from '@/components/layout/TrainerSidebar';

interface Props {
  trainerName: string;
  gymName: string;
  userName: string;
  children: React.ReactNode;
}

export default function TrainerLayoutClient({ trainerName, gymName, userName, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Trainer header */}
      <header className="h-16 bg-zinc-950/90 border-b border-zinc-800/50 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all md:hidden"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <span className="text-lg">💪</span>
            </div>
            <div>
              <span className="text-lg font-black text-white">GymFit <span className="text-blue-400">Pro</span></span>
              <span className="text-xs text-zinc-500 ml-2 hidden sm:inline">Trainer Portal</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{userName}</p>
            <p className="text-xs text-zinc-500">{gymName}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-sm font-bold text-white">
            {userName?.charAt(0) || 'T'}
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

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar — drawer on mobile, static on desktop */}
        <div
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-transform duration-300 ease-in-out
            md:relative md:top-auto md:h-auto md:translate-x-0 md:z-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <TrainerSidebar
            trainerName={trainerName}
            gymName={gymName}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
        <main className="flex-1 overflow-auto page-enter min-w-0">{children}</main>
      </div>
    </div>
  );
}
