'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Gym {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  _count: { members: number; trainers: number; staff: number };
}

const gymMeta: Record<string, { icon: string; color: string; tagline: string }> = {
  'atom-fit': { icon: '⚡', color: 'from-red-600 to-red-900', tagline: 'Powered by Intensity' },
  'pulse-fit': { icon: '💓', color: 'from-rose-600 to-pink-900', tagline: 'Feel the Pulse' },
  'power-fit': { icon: '💪', color: 'from-orange-600 to-red-900', tagline: 'Unleash Your Power' },
  'impact-fit': { icon: '🔥', color: 'from-red-700 to-zinc-900', tagline: 'Make an Impact' },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gyms')
      .then((r) => r.json())
      .then((data) => { setGyms(data); setLoading(false); });
  }, []);

  return (
    <div className="paint-splash min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-10">
      {/* Welcome banner */}
      <div className="relative mb-10">
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950" />
          <div className="absolute top-0 right-0 w-96 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, #e11d48 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
          />
        </div>
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-2">Welcome back</p>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              {session?.user?.name} 👋
            </h1>
            <p className="text-zinc-400 mt-2 text-base">
              You own <span className="text-red-400 font-bold">{gyms.length}</span> gyms with{' '}
              <span className="text-white font-bold">
                {gyms.reduce((a, g) => a + g._count.members, 0)}
              </span>{' '}
              total members
            </p>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <div className="bg-zinc-800/80 rounded-2xl px-4 md:px-5 py-3 text-center border border-zinc-700/50">
              <p className="text-xl md:text-2xl font-black text-white">{gyms.reduce((a, g) => a + g._count.members, 0)}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Members</p>
            </div>
            <div className="bg-zinc-800/80 rounded-2xl px-4 md:px-5 py-3 text-center border border-zinc-700/50">
              <p className="text-xl md:text-2xl font-black text-red-400">{gyms.reduce((a, g) => a + g._count.trainers, 0)}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Trainers</p>
            </div>
            <div className="bg-zinc-800/80 rounded-2xl px-4 md:px-5 py-3 text-center border border-zinc-700/50">
              <p className="text-xl md:text-2xl font-black text-white">{gyms.reduce((a, g) => a + g._count.staff, 0)}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">My Gyms</h2>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Gym Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-56 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gyms.map((gym) => {
            const meta = gymMeta[gym.slug] || { icon: '🏋️', color: 'from-red-700 to-red-950', tagline: 'Train Hard' };
            return (
              <Link key={gym.id} href={`/gym/${gym.id}`}>
                <div className="gym-card bg-zinc-900 border-2 border-zinc-800 rounded-3xl overflow-hidden cursor-pointer h-56 flex flex-col">
                  {/* Card header with gradient */}
                  <div className={`bg-gradient-to-br ${meta.color} p-6 flex items-center gap-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)' }}
                    />
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20">
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{gym.name}</h3>
                      <p className="text-white/70 text-sm font-medium">{meta.tagline}</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-zinc-500 text-xs truncate">📍 {gym.address || 'Address not set'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xl font-black text-white">{gym._count.members}</p>
                          <p className="text-xs text-zinc-500">Members</p>
                        </div>
                        <div>
                          <p className="text-xl font-black text-red-400">{gym._count.trainers}</p>
                          <p className="text-xs text-zinc-500">Trainers</p>
                        </div>
                        <div>
                          <p className="text-xl font-black text-white">{gym._count.staff}</p>
                          <p className="text-xs text-zinc-500">Staff</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                        <span className="text-red-400 text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
