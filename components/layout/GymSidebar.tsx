'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface GymSidebarProps {
  gymId: string;
  gymName: string;
}

const navItems = [
  { href: '', label: 'Overview', icon: '📊' },
  { href: '/equipment', label: 'Equipment', icon: '🏋️' },
  { href: '/trainers', label: 'Trainers', icon: '👨‍💼' },
  { href: '/staff', label: 'Other Staff', icon: '👥' },
  { href: '/members', label: 'Members', icon: '🏃' },
  { href: '/attendance', label: 'Attendance', icon: '📅' },
  { href: '/expenses', label: 'Expenses', icon: '💰' },
  { href: '/events', label: 'Events & Announcements', icon: '📢' },
];

export default function GymSidebar({ gymId, gymName }: GymSidebarProps) {
  const pathname = usePathname();
  const basePath = `/gym/${gymId}`;

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-zinc-950/80 border-r border-zinc-800/50 flex flex-col">
      {/* Gym info */}
      <div className="p-5 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(225,29,72,0.2)]">
            💪
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-0.5">Current Gym</p>
            <p className="text-sm font-bold text-white leading-tight">{gymName}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive = item.href === ''
            ? pathname === basePath
            : pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={item.href}
              href={href}
              className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'active bg-red-600/10 text-red-400 border-l-0'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to dashboard */}
      <div className="p-3 border-t border-zinc-800/50">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-all"
        >
          <span>←</span>
          <span>All Gyms</span>
        </Link>
      </div>
    </aside>
  );
}
