'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import GymSidebar from '@/components/layout/GymSidebar';

interface Props {
  gymId: string;
  gymName: string;
  children: React.ReactNode;
}

export default function GymLayoutClient({ gymId, gymName, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
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
            md:relative md:top-auto md:h-auto md:translate-x-0 md:z-auto md:block
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <GymSidebar gymId={gymId} gymName={gymName} onClose={() => setSidebarOpen(false)} />
        </div>
        <main className="flex-1 overflow-auto page-enter min-w-0">{children}</main>
      </div>
    </div>
  );
}
