'use client';

import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
}

interface TrainerInfo {
  id: string;
  gym: { id: string };
}

export default function TrainerAttendancePage() {
  const [trainer, setTrainer] = useState<TrainerInfo | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trainer/me')
      .then(r => r.json())
      .then(async (t) => {
        setTrainer(t);
        // Fetch last 30 days attendance
        const res = await fetch(`/api/attendance?gymId=${t.gymId || t.gym?.id}&type=TRAINER`);
        const all = await res.json();
        const mine = all.filter((a: { trainer?: { id: string } }) => a.trainer?.id === t.id);
        setRecords(mine);
        setLoading(false);
      });
  }, []);

  const presentDays = records.filter(r => r.status === 'PRESENT').length;
  const absentDays = records.filter(r => r.status === 'ABSENT').length;
  const lateDays = records.filter(r => r.status === 'LATE').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">📅 My Attendance</h1>
        <p className="text-zinc-500 text-sm">Your attendance history</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-emerald-400">{presentDays}</p>
          <p className="text-xs text-zinc-500 mt-1">Present Days</p>
        </div>
        <div className="bg-red-950/30 border border-red-800/30 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-red-400">{absentDays}</p>
          <p className="text-xs text-zinc-500 mt-1">Absent Days</p>
        </div>
        <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-yellow-400">{lateDays}</p>
          <p className="text-xs text-zinc-500 mt-1">Late Days</p>
        </div>
      </div>

      {/* Attendance records */}
      {loading ? (
        <div className="space-y-3">{[...Array(7)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-4xl mb-3">📅</p>
          <p>No attendance records yet</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Check In</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Check Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="table-row-hover border-b border-zinc-800/50 last:border-0">
                  <td className="px-5 py-4 text-sm text-white font-medium">
                    {new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      r.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400' :
                      r.status === 'ABSENT' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-400">{r.checkInTime || '—'}</td>
                  <td className="px-5 py-4 text-sm text-zinc-400">{r.checkOutTime || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
