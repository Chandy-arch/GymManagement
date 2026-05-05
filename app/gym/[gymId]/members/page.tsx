'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getGoalColor, getMembershipColor, getAgeGroupColor, FITNESS_GOALS, EXPERIENCE_LEVELS, MOTIVATION_LEVELS, PERSONALITIES, MEMBERSHIP_PLANS, AGE_GROUPS, GENDERS, HEALTH_CONDITIONS } from '@/lib/utils';

interface Trainer { id: string; name: string; }
interface Member {
  id: string; name: string; ageGroup: string; gender: string; fitnessGoal: string;
  experienceLevel: string; motivationLevel: string; personality: string;
  membershipPlan: string; healthConditions: string; isActive: boolean;
  mobileNo: string | null; email: string | null;
  personalTrainer: Trainer | null; joinDate: string;
}

const emptyForm = {
  name: '', ageGroup: 'Adults (20-40)', gender: 'Male', fitnessGoal: 'General Fitness',
  experienceLevel: 'Beginner', motivationLevel: 'Goal-Oriented', personality: 'Solo Trainer',
  membershipPlan: 'Monthly', personalTrainerId: '', healthConditions: [] as string[],
  mobileNo: '', email: '',
};

export default function MembersPage({ params }: { params: { gymId: string } }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterGoal, setFilterGoal] = useState('');

  const fetchData = () => {
    Promise.all([
      fetch(`/api/members?gymId=${params.gymId}`).then(r => r.json()),
      fetch(`/api/trainers?gymId=${params.gymId}`).then(r => r.json()),
    ]).then(([m, t]) => { setMembers(m); setTrainers(t); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [params.gymId]);

  const handleOpen = (m?: Member) => {
    if (m) {
      setEditing(m);
      setForm({
        name: m.name, ageGroup: m.ageGroup, gender: m.gender, fitnessGoal: m.fitnessGoal,
        experienceLevel: m.experienceLevel, motivationLevel: m.motivationLevel,
        personality: m.personality, membershipPlan: m.membershipPlan,
        personalTrainerId: m.personalTrainer?.id || '',
        healthConditions: JSON.parse(m.healthConditions || '[]'),
        mobileNo: m.mobileNo || '', email: m.email || '',
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setIsOpen(true);
  };

  const handleClose = () => { setIsOpen(false); setEditing(null); setForm({ ...emptyForm, healthConditions: [] }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, gymId: params.gymId };
    if (editing) {
      await fetch(`/api/members/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setSaving(false);
    handleClose();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const toggleHealthCondition = (c: string) => {
    setForm(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(c)
        ? prev.healthConditions.filter(x => x !== c)
        : [...prev.healthConditions, c],
    }));
  };

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchGoal = filterGoal ? m.fitnessGoal === filterGoal : true;
    return matchSearch && matchGoal;
  });

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">🏃 Members</h1>
          <p className="text-zinc-500 text-sm">{members.length} member{members.length !== 1 ? 's' : ''} enrolled</p>
        </div>
        <Button onClick={() => handleOpen()}>+ Add Member</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="gym-input flex-1 min-w-48 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
        />
        <select
          value={filterGoal}
          onChange={e => setFilterGoal(e.target.value)}
          className="gym-input bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
        >
          <option value="">All Goals</option>
          {FITNESS_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-5xl mb-4">🏃</p>
          <p className="text-lg font-semibold">No members found</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-zinc-800">
                {['Name', 'Age Group', 'Goal', 'Plan', 'Trainer', 'Health', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(m => {
                  const hc = JSON.parse(m.healthConditions || '[]') as string[];
                  return (
                    <tr key={m.id} className="table-row-hover border-b border-zinc-800/50 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-xs font-bold text-red-400">{m.name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-semibold text-white">{m.name}</p>
                            <p className="text-xs text-zinc-500">{m.gender} • {m.experienceLevel}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAgeGroupColor(m.ageGroup)}`}>{m.ageGroup}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getGoalColor(m.fitnessGoal)}`}>{m.fitnessGoal}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getMembershipColor(m.membershipPlan)}`}>{m.membershipPlan}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-400">{m.personalTrainer?.name || <span className="text-zinc-600">—</span>}</td>
                      <td className="px-5 py-4">
                        {hc.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {hc.map(c => <Badge key={c} variant="warning">{c}</Badge>)}
                          </div>
                        ) : <span className="text-zinc-600 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpen(m)}>✏️</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(m.id)}>🗑️</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} title={editing ? 'Edit Member' : 'Add New Member'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="Arun Krishnamurthy" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Age Group *</label>
              <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Gender *</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Fitness Goal *</label>
              <select value={form.fitnessGoal} onChange={e => setForm({ ...form, fitnessGoal: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {FITNESS_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Experience Level</label>
              <select value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Motivation Type</label>
              <select value={form.motivationLevel} onChange={e => setForm({ ...form, motivationLevel: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {MOTIVATION_LEVELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Personality</label>
              <select value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Membership Plan</label>
              <select value={form.membershipPlan} onChange={e => setForm({ ...form, membershipPlan: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                {MEMBERSHIP_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Personal Trainer</label>
              <select value={form.personalTrainerId} onChange={e => setForm({ ...form, personalTrainerId: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                <option value="">No personal trainer</option>
                {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Mobile No</label>
              <input type="text" value={form.mobileNo} onChange={e => setForm({ ...form, mobileNo: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Health Conditions (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {HEALTH_CONDITIONS.map(c => (
                <button key={c} type="button"
                  onClick={() => toggleHealthCondition(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    form.healthConditions.includes(c)
                      ? 'bg-yellow-600/20 border-yellow-600 text-yellow-300'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Add'} Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
