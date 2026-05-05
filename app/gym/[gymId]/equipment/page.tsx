'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { calculateAge, formatCurrency, EQUIPMENT_CONDITIONS } from '@/lib/utils';

interface Equipment {
  id: string;
  name: string;
  yearOfManufacture: number;
  price: number;
  condition: string;
  createdAt: string;
}

const emptyForm = { name: '', yearOfManufacture: new Date().getFullYear(), price: '', condition: 'Good' };

export default function EquipmentPage({ params }: { params: { gymId: string } }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchEquipment = () => {
    fetch(`/api/equipment?gymId=${params.gymId}`)
      .then(r => r.json())
      .then(data => { setEquipment(data); setLoading(false); });
  };

  useEffect(() => { fetchEquipment(); }, [params.gymId]);

  const handleOpen = (eq?: Equipment) => {
    if (eq) {
      setEditing(eq);
      setForm({ name: eq.name, yearOfManufacture: eq.yearOfManufacture, price: String(eq.price), condition: eq.condition });
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
      await fetch(`/api/equipment/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/equipment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, gymId: params.gymId }) });
    }
    setSaving(false);
    handleClose();
    fetchEquipment();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this equipment?')) return;
    await fetch(`/api/equipment/${id}`, { method: 'DELETE' });
    fetchEquipment();
  };

  const filtered = equipment.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">🏋️ Gym Equipment</h1>
          <p className="text-zinc-500 text-sm">{equipment.length} items registered</p>
        </div>
        <Button onClick={() => handleOpen()}>+ Add Equipment</Button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search equipment..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="gym-input w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
      />

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-5xl mb-4">🏋️</p>
          <p className="text-lg font-semibold">No equipment found</p>
          <p className="text-sm mt-1">Add your first equipment to get started</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Equipment Name</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Year</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Age</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Condition</th>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((eq) => {
                  const age = calculateAge(eq.yearOfManufacture);
                  const ageColor = age <= 2 ? 'text-emerald-400' : age <= 5 ? 'text-yellow-400' : 'text-red-400';
                  return (
                    <tr key={eq.id} className="table-row-hover border-b border-zinc-800/50 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-sm">🔩</div>
                          <span className="text-sm font-semibold text-white">{eq.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-400">{eq.yearOfManufacture}</td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-bold ${ageColor}`}>
                          {age} yr{age !== 1 ? 's' : ''} old
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-white">{formatCurrency(eq.price)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          eq.condition === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                          eq.condition === 'Good' ? 'bg-blue-500/10 text-blue-400' :
                          eq.condition === 'Fair' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                        }`}>{eq.condition}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpen(eq)}>✏️</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(eq.id)}>🗑️</Button>
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

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} title={editing ? 'Edit Equipment' : 'Add Equipment'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Equipment Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
              placeholder="e.g. Treadmill Pro X500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Year of Manufacturing *</label>
              <input
                type="number"
                value={form.yearOfManufacture}
                onChange={e => setForm({ ...form, yearOfManufacture: Number(e.target.value) })}
                min={1990}
                max={currentYear}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
                placeholder="85000"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Condition</label>
            <select
              value={form.condition}
              onChange={e => setForm({ ...form, condition: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            >
              {EQUIPMENT_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {form.yearOfManufacture && (
            <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
              <p className="text-xs text-zinc-400">Equipment age: <span className="text-white font-bold">{calculateAge(Number(form.yearOfManufacture))} year(s)</span></p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Add'} Equipment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
