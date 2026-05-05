'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OverviewData {
  gym: { id: string; name: string; address: string; phone: string };
  members: { id: string; name: string; fitnessGoal: string; membershipPlan: string; joinDate: string }[];
  trainers: { id: string; name: string; specialization: string; experience: number }[];
  staff: { id: string; name: string; role: string }[];
  equipment: { id: string; name: string; yearOfManufacture: number; condition: string }[];
  expenses: { id: string; amount: number; category: string; title: string }[];
  events: { id: string; title: string; date: string; targetAudience: string }[];
  todayAttendance: { id: string; type: string; status: string; trainer?: { name: string }; member?: { name: string } }[];
}

export default function GymOverviewPage({ params }: { params: { gymId: string } }) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      fetch(`/api/gyms`).then(r => r.json()),
      fetch(`/api/members?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/trainers?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/staff?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/equipment?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/expenses?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/events?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/attendance?gymId=${params.gymId}&date=${today}`).then(r => r.json()),
    ]).then(([gyms, members, trainers, staff, equipment, expenses, events, attendance]) => {
      const gym = gyms.find((g: { id: string }) => g.id === params.gymId);
      setData({ gym, members, trainers, staff, equipment, expenses, events, todayAttendance: attendance });
      setLoading(false);
    });
  }, [params.gymId]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="skeleton h-32 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalExpense = data.expenses.reduce((a, e) => a + e.amount, 0);
  const todayPresent = data.todayAttendance.filter(a => a.status === 'PRESENT').length;
  const upcomingEvents = data.events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Gym banner */}
      <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 overflow-hidden border border-zinc-800">
        <div className="absolute top-0 right-0 w-80 h-64 opacity-15 rounded-full"
          style={{ background: 'radial-gradient(ellipse, #e11d48 0%, transparent 70%)', transform: 'translate(30%,-20%)' }}
        />
        <div className="relative">
          <h1 className="text-3xl font-black text-white mb-1">{data.gym?.name}</h1>
          <p className="text-zinc-400 text-sm">📍 {data.gym?.address}</p>
          {data.gym?.phone && <p className="text-zinc-400 text-sm">📞 {data.gym?.phone}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Members" value={data.members.length} icon="🏃" color="red" />
        <StatCard label="Active Trainers" value={data.trainers.filter(t => t).length} icon="👨‍💼" color="blue" />
        <StatCard label="Staff Members" value={data.staff.length} icon="👥" color="emerald" />
        <StatCard label="Monthly Expenses" value={formatCurrency(totalExpense)} icon="💰" color="orange" />
      </div>

      {/* Today's snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Attendance */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>📅</span> Today&apos;s Attendance
          </h3>
          {data.todayAttendance.length === 0 ? (
            <p className="text-zinc-500 text-sm">No attendance marked yet</p>
          ) : (
            <div className="space-y-2">
              {data.todayAttendance.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">
                    {a.trainer?.name || a.member?.name || 'Unknown'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    a.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>{a.status}</span>
                </div>
              ))}
              <p className="text-xs text-zinc-500 pt-1">{todayPresent} present today</p>
            </div>
          )}
        </div>

        {/* Recent Members */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>🏃</span> Recent Members
          </h3>
          <div className="space-y-2">
            {data.members.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300 truncate">{m.name}</span>
                <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">{m.membershipPlan}</span>
              </div>
            ))}
            {data.members.length === 0 && <p className="text-zinc-500 text-sm">No members yet</p>}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>📢</span> Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((e) => (
              <div key={e.id} className="border-l-2 border-red-600 pl-3">
                <p className="text-sm text-white font-medium leading-tight">{e.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{formatDate(e.date)}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded text-xs font-medium mt-1 inline-block ${
                  e.targetAudience === 'ALL' ? 'bg-emerald-500/10 text-emerald-400' :
                  e.targetAudience === 'TRAINERS' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                }`}>{e.targetAudience}</span>
              </div>
            ))}
            {upcomingEvents.length === 0 && <p className="text-zinc-500 text-sm">No upcoming events</p>}
          </div>
        </div>
      </div>

      {/* Equipment status */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span>🏋️</span> Equipment ({data.equipment.length} items)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.equipment.slice(0, 10).map((eq) => {
            const age = new Date().getFullYear() - eq.yearOfManufacture;
            return (
              <div key={eq.id} className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
                <p className="text-sm text-white font-medium leading-tight mb-1 truncate">{eq.name}</p>
                <p className="text-xs text-zinc-500">{age} yr{age !== 1 ? 's' : ''} old</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block font-medium ${
                  eq.condition === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                  eq.condition === 'Good' ? 'bg-blue-500/10 text-blue-400' :
                  eq.condition === 'Fair' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                }`}>{eq.condition}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
