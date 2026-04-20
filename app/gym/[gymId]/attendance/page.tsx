'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  type: string;
  status: string;
  notes: string | null;
  trainer?: { id: string; name: string } | null;
  member?: { id: string; name: string } | null;
}

interface Person { id: string; name: string; }

export default function AttendancePage({ params }: { params: { gymId: string } }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [trainers, setTrainers] = useState<Person[]>([]);
  const [members, setMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'TRAINER' | 'MEMBER'>('TRAINER');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchData = (date: string) => {
    setLoading(true);
    Promise.all([
      fetch(`/api/attendance?gymId=${params.gymId}&date=${date}`).then(r => r.json()),
      fetch(`/api/trainers?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/members?gymId=${params.gymId}`).then(r => r.json()),
    ]).then(([att, t, m]) => { setRecords(att); setTrainers(t); setMembers(m); setLoading(false); });
  };

  useEffect(() => { fetchData(selectedDate); }, [params.gymId, selectedDate]);

  const getRecord = (id: string, type: string) =>
    records.find(r => (type === 'TRAINER' ? r.trainer?.id : r.member?.id) === id);

  const markAttendance = async (id: string, type: 'TRAINER' | 'MEMBER', status: string) => {
    setMarkingId(id);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        trainerId: type === 'TRAINER' ? id : undefined,
        memberId: type === 'MEMBER' ? id : undefined,
        gymId: params.gymId,
        status,
        checkInTime: status === 'PRESENT' ? timeStr : null,
        date: selectedDate,
      }),
    });
    setMarkingId(null);
    fetchData(selectedDate);
  };

  const people = activeTab === 'TRAINER' ? trainers : members;
  const todayRecords = records.filter(r => r.type === activeTab);
  const presentCount = todayRecords.filter(r => r.status === 'PRESENT').length;
  const absentCount = todayRecords.filter(r => r.status === 'ABSENT').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">📅 Attendance Tracker</h1>
          <p className="text-zinc-500 text-sm">Mark and view daily attendance</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="gym-input bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-white">{people.length}</p>
          <p className="text-zinc-500 text-xs mt-1">Total {activeTab === 'TRAINER' ? 'Trainers' : 'Members'}</p>
        </div>
        <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-emerald-400">{presentCount}</p>
          <p className="text-zinc-500 text-xs mt-1">Present</p>
        </div>
        <div className="bg-red-950/30 border border-red-800/30 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-red-400">{absentCount}</p>
          <p className="text-zinc-500 text-xs mt-1">Absent</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl w-fit border border-zinc-800">
        {(['TRAINER', 'MEMBER'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
            {tab === 'TRAINER' ? '👨‍💼 Trainers' : '🏃 Members'}
          </button>
        ))}
      </div>

      {/* Attendance list */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : people.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-4xl mb-3">{activeTab === 'TRAINER' ? '👨‍💼' : '🏃'}</p>
          <p>No {activeTab.toLowerCase()}s in this gym yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {people.map(person => {
            const rec = getRecord(person.id, activeTab);
            const isMarking = markingId === person.id;
            return (
              <div key={person.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                    activeTab === 'TRAINER' ? 'bg-blue-600/10 text-blue-400' : 'bg-red-600/10 text-red-400'
                  }`}>{person.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{person.name}</p>
                    {rec && (
                      <p className="text-xs text-zinc-500">
                        {rec.checkInTime && `In: ${rec.checkInTime}`}
                        {rec.checkOutTime && ` • Out: ${rec.checkOutTime}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rec ? (
                    <span className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${
                      rec.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      rec.status === 'ABSENT' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {rec.status === 'PRESENT' ? '✓ Present' : rec.status === 'ABSENT' ? '✗ Absent' : '⚠ Late'}
                    </span>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" loading={isMarking}
                        onClick={() => markAttendance(person.id, activeTab, 'PRESENT')}>
                        ✓ Present
                      </Button>
                      <Button size="sm" variant="danger" loading={isMarking}
                        onClick={() => markAttendance(person.id, activeTab, 'ABSENT')}>
                        ✗ Absent
                      </Button>
                      <Button size="sm" variant="secondary" loading={isMarking}
                        onClick={() => markAttendance(person.id, activeTab, 'LATE')}>
                        ⚠ Late
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
