'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatDate, TARGET_AUDIENCES } from '@/lib/utils';

interface GymEvent {
  id: string; title: string; description: string; date: string; targetAudience: string; isActive: boolean;
}

const emptyForm = {
  title: '', description: '', date: '', targetAudience: 'ALL',
};

const audienceConfig = {
  ALL: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '🌐', label: 'Everyone' },
  TRAINERS: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: '👨‍💼', label: 'Trainers Only' },
  MEMBERS: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '🏃', label: 'Members Only' },
};

export default function EventsPage({ params }: { params: { gymId: string } }) {
  const [events, setEvents] = useState<GymEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterAudience, setFilterAudience] = useState('');

  const fetchEvents = () => {
    fetch(`/api/events?gymId=${params.gymId}`).then(r => r.json()).then(d => { setEvents(d); setLoading(false); });
  };

  useEffect(() => { fetchEvents(); }, [params.gymId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, gymId: params.gymId }) });
    setSaving(false);
    setIsOpen(false);
    setForm(emptyForm);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const filtered = filterAudience ? events.filter(e => e.targetAudience === filterAudience) : events;
  const upcoming = events.filter(e => new Date(e.date) >= new Date()).length;
  const past = events.filter(e => new Date(e.date) < new Date()).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">📢 Events & Announcements</h1>
          <p className="text-zinc-500 text-sm">{upcoming} upcoming • {past} past</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>+ Create Event</Button>
      </div>

      {/* Audience filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterAudience('')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all ${!filterAudience ? 'bg-zinc-700 text-white border-zinc-600' : 'text-zinc-500 border-zinc-700 hover:border-zinc-600'}`}>
          All Events
        </button>
        {TARGET_AUDIENCES.map(a => {
          const cfg = audienceConfig[a as keyof typeof audienceConfig];
          return (
            <button key={a} onClick={() => setFilterAudience(a)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filterAudience === a ? `${cfg.color} border` : 'text-zinc-500 border-zinc-700 hover:border-zinc-600'}`}>
              {cfg.icon} {cfg.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-5xl mb-4">📢</p>
          <p className="text-lg font-semibold">No events yet</p>
          <p className="text-sm mt-1">Create your first event or announcement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(event => {
            const isUpcoming = new Date(event.date) >= new Date();
            const cfg = audienceConfig[event.targetAudience as keyof typeof audienceConfig] || audienceConfig.ALL;
            return (
              <div key={event.id} className={`bg-zinc-900 border rounded-2xl p-5 relative overflow-hidden ${isUpcoming ? 'border-zinc-700' : 'border-zinc-800 opacity-70'}`}>
                {isUpcoming && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-900" />
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      {isUpcoming && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/10 text-red-400 border border-red-600/20 font-medium">Upcoming</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{event.title}</h3>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>🗑️</Button>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-3 line-clamp-3">{event.description}</p>
                <p className="text-xs text-zinc-500 flex items-center gap-1">
                  📅 {formatDate(event.date)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setForm(emptyForm); }} title="Create Event / Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="Summer Fitness Challenge 2026" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4} className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              placeholder="Describe the event or announcement in detail..." required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Target Audience *</label>
              <select value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {TARGET_AUDIENCES.map(a => {
                  const cfg = audienceConfig[a as keyof typeof audienceConfig];
                  return <option key={a} value={a}>{cfg.icon} {cfg.label}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setIsOpen(false); setForm(emptyForm); }} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Create Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
