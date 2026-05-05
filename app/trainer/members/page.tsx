'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGoalColor, getMembershipColor } from '@/lib/utils';

interface Member {
  id: string; name: string; ageGroup: string; gender: string; fitnessGoal: string;
  experienceLevel: string; motivationLevel: string; personality: string;
  membershipPlan: string; healthConditions: string; joinDate: string;
  mobileNo: string | null;
}

interface TrainerData {
  id: string;
  name: string;
  members: Member[];
}

export default function TrainerMembersPage() {
  const [trainer, setTrainer] = useState<TrainerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/trainer/me').then(r => r.json()).then(d => { setTrainer(d); setLoading(false); });
  }, []);

  const filtered = trainer?.members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.fitnessGoal.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">🏃 My Members</h1>
        <p className="text-zinc-500 text-sm">{trainer?.members.length || 0} members assigned to you</p>
      </div>

      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="gym-input w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-4xl mb-3">🏃</p>
          <p>No members assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(m => {
            const hc = JSON.parse(m.healthConditions || '[]') as string[];
            return (
              <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-800/30 flex items-center justify-center text-lg font-bold text-blue-400">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{m.name}</h3>
                      <p className="text-xs text-zinc-500">{m.gender} • {m.ageGroup}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getMembershipColor(m.membershipPlan)}`}>
                    {m.membershipPlan}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Fitness Goal</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getGoalColor(m.fitnessGoal)}`}>{m.fitnessGoal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Experience</span>
                    <span className="text-xs text-zinc-300">{m.experienceLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Motivation</span>
                    <span className="text-xs text-zinc-300">{m.motivationLevel}</span>
                  </div>
                  {m.mobileNo && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Mobile</span>
                      <span className="text-xs text-zinc-300">{m.mobileNo}</span>
                    </div>
                  )}
                </div>

                {hc.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {hc.map(c => (
                      <span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">⚠ {c}</span>
                    ))}
                  </div>
                )}

                <Link href={`/trainer/members/${m.id}/food`}>
                  <button className="w-full py-2.5 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-semibold hover:bg-blue-600/20 transition-all">
                    🥗 View Food Recommendations
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
