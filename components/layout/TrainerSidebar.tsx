'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/trainer', label: 'Dashboard', icon: '📊' },
  { href: '/trainer/attendance', label: 'My Attendance', icon: '📅' },
  { href: '/trainer/members', label: 'My Members', icon: '🏃' },
];

interface TrainerSidebarProps {
  trainerName: string;
  gymName: string;
  onClose?: () => void;
}

export default function TrainerSidebar({ trainerName, gymName, onClose }: TrainerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full min-h-[calc(100vh-4rem)] bg-zinc-950 border-r border-zinc-800/50 flex flex-col overflow-y-auto">
      {/* Trainer info */}
      <div className="p-5 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-lg">
            👨‍💼
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-0.5">{gymName}</p>
            <p className="text-sm font-bold text-white leading-tight">{trainerName}</p>
            <p className="text-xs text-blue-400">Trainer</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/trainer' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-zinc-800/50">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-all w-full"
        >
          <span>⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
