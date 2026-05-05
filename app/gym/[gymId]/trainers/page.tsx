'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface Trainer {
  id: string;
  name: string;
  salary: number;
  experience: number;
  mobileNo: string;
  reportingTo: string | null;
  specialization: string;
  isActive: boolean;
  _count: { members: number };
  user?: { email: string } | null;
}

const emptyForm = {
  name: '', salary: '', experience: '', mobileNo: '', reportingTo: '', specialization: 'General Fitness',
};

export default function TrainersPage({ params }: { params: { gymId: string } }) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchTrainers = () => {
    fetch(`/api/trainers?gymId=${params.gymId}`).then(r => r.json()).then(d => { setTrainers(d); setLoading(false); });
  };

  useEffect(() => { fetchTrainers(); }, [params.gymId]);

  const handleOpen = (t?: Trainer) => {
    if (t) {
      setEditing(t);
      setForm({ name: t.name, salary: String(t.salary), experience: String(t.experience), mobileNo: t.mobileNo, reportingTo: t.reportingTo || '', specialization: t.specialization });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setIsOpen(true);
  };

  const handleClose = () => { setIsOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await fetch(`/api/trainers/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/trainers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, gymId: params.gymId }) });
    }
    setSaving(false);
    handleClose();
    fetchTrainers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trainer?')) return;
    await fetch(`/api/trainers/${id}`, { method: 'DELETE' });
    fetchTrainers();
  };

  const specializations = ['General Fitness', 'Strength Training', 'Weight Loss & Cardio', 'Yoga & Flexibility', 'Sports Performance', 'Bodybuilding', 'Rehabilitation'];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">👨‍💼 Trainers</h1>
          <p className="text-zinc-500 text-sm">{trainers.length} trainer{trainers.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button onClick={() => handleOpen()}>+ Add Trainer</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-5xl mb-4">👨‍💼</p>
          <p className="text-lg font-semibold">No trainers yet</p>
          <p className="text-sm mt-1">Add trainers to your gym</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {trainers.map((t) => (
            <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-800/30 flex items-center justify-center text-xl">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.name}</h3>
                    <p className="text-xs text-blue-400">{t.specialization}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
                  {t.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Experience</span>
                  <span className="text-white font-medium">{t.experience} yr{t.experience !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Salary</span>
                  <span className="text-white font-medium">{formatCurrency(t.salary)}/mo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Mobile</span>
                  <span className="text-white font-medium">{t.mobileNo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Members</span>
                  <span className="text-red-400 font-bold">{t._count.members}</span>
                </div>
                {t.reportingTo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Reports to</span>
                    <span className="text-white text-xs truncate max-w-32">{t.reportingTo}</span>
                  </div>
                )}
              </div>

              {t.user && (
                <div className="bg-zinc-800/50 rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs text-zinc-500">Login: <span className="text-zinc-300">{t.user.email}</span></p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleOpen(t)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} title={editing ? 'Edit Trainer' : 'Add Trainer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Full Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="Vikram Singh" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Salary (₹/month) *</label>
              <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="35000" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Experience (years) *</label>
              <input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="5" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Mobile No *</label>
            <input type="text" value={form.mobileNo} onChange={e => setForm({ ...form, mobileNo: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="+91 99887 66554" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Specialization</label>
            <select value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Reporting To</label>
            <input type="text" value={form.reportingTo} onChange={e => setForm({ ...form, reportingTo: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="Raj Kumar (Owner)" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Add'} Trainer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
