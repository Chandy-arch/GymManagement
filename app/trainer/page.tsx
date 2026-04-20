'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TrainerData {
  id: string;
  name: string;
  salary: number;
  experience: number;
  mobileNo: string;
  specialization: string;
  reportingTo: string | null;
  gym: { name: string; address: string };
  members: {
    id: string; name: string; fitnessGoal: string; membershipPlan: string;
    ageGroup: string; healthConditions: string; joinDate: string;
  }[];
}

interface TodayAttendance {
  id: string;
  status: string;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export default function TrainerDashboardPage() {
  const [trainer, setTrainer] = useState<TrainerData | null>(null);
  const [todayAtt, setTodayAtt] = useState<TodayAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const fetchData = async () => {
    const res = await fetch('/api/trainer/me');
    const data = await res.json();
    setTrainer(data);

    // Fetch today's attendance for this trainer
    const today = new Date().toISOString().split('T')[0];
    if (data.id) {
      const attRes = await fetch(`/api/attendance?gymId=${data.gym?.id}&type=TRAINER&date=${today}`);
      const attData = await attRes.json();
      const mine = attData.find((a: { trainer?: { id: string } }) => a.trainer?.id === data.id);
      setTodayAtt(mine || null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckIn = async () => {
    if (!trainer) return;
    setCheckingIn(true);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'TRAINER', trainerId: trainer.id, gymId: trainer.gym ? (trainer as unknown as { gymId: string }).gymId : '',
        status: 'PRESENT', checkInTime: timeStr, date: new Date().toISOString().split('T')[0],
      }),
    });
    setCheckingIn(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    );
  }

  if (!trainer) return <div className="p-6 text-zinc-400">Trainer profile not found</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-56 opacity-10 rounded-full"
          style={{ background: 'radial-gradient(ellipse, #2563eb 0%, transparent 70%)', transform: 'translate(30%,-20%)' }}
        />
        <div className="relative">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Trainer Dashboard</p>
          <h1 className="text-3xl font-black text-white mb-1">Welcome, {trainer.name}!</h1>
          <p className="text-zinc-400 text-sm">📍 {trainer.gym?.name} • {trainer.specialization}</p>
          <p className="text-zinc-500 text-sm">⭐ {trainer.experience} years experience • {formatCurrency(trainer.salary)}/month</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-blue-400">{trainer.members.length}</p>
          <p className="text-xs text-zinc-500 mt-1">My Members</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-emerald-400">{trainer.experience}</p>
          <p className="text-xs text-zinc-500 mt-1">Years Experience</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-lg font-black text-white">{formatCurrency(trainer.salary)}</p>
          <p className="text-xs text-zinc-500 mt-1">Monthly Salary</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-sm font-bold text-zinc-300">{trainer.specialization}</p>
          <p className="text-xs text-zinc-500 mt-1">Specialization</p>
        </div>
      </div>

      {/* Check-in / Attendance */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">📅 Today&apos;s Attendance</h3>
        {todayAtt ? (
          <div className="flex items-center gap-4">
            <span className={`text-sm px-4 py-2 rounded-xl font-semibold ${
              todayAtt.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {todayAtt.status === 'PRESENT' ? '✓ Present' : '✗ Absent'}
            </span>
            {todayAtt.checkInTime && <span className="text-sm text-zinc-400">Check-in: <span className="text-white font-medium">{todayAtt.checkInTime}</span></span>}
            {todayAtt.checkOutTime && <span className="text-sm text-zinc-400">Check-out: <span className="text-white font-medium">{todayAtt.checkOutTime}</span></span>}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-sm text-zinc-400">No attendance marked for today</p>
            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            >
              {checkingIn ? 'Checking in...' : '✓ Check In Now'}
            </button>
          </div>
        )}
      </div>

      {/* My Members preview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">🏃 My Members ({trainer.members.length})</h3>
          <Link href="/trainer/members" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View all →</Link>
        </div>
        {trainer.members.length === 0 ? (
          <p className="text-zinc-500 text-sm">No members assigned yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trainer.members.slice(0, 4).map(m => {
              const hc = JSON.parse(m.healthConditions || '[]') as string[];
              return (
                <Link key={m.id} href={`/trainer/members/${m.id}/food`}>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:border-blue-600/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white">{m.name}</p>
                      <span className="text-xs text-zinc-500">{m.membershipPlan}</span>
                    </div>
                    <p className="text-xs text-blue-400">{m.fitnessGoal}</p>
                    {hc.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {hc.map(c => <span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">{c}</span>)}
                      </div>
                    )}
                    <p className="text-xs text-blue-500 mt-2">View food recommendations →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
