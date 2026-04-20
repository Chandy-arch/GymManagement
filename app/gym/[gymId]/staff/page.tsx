'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface Staff {
  id: string;
  name: string;
  salary: number;
  monthlyExpenditure: number;
  role: string;
  mobileNo: string | null;
  isActive: boolean;
}

const emptyForm = { name: '', salary: '', monthlyExpenditure: '', role: 'Receptionist', mobileNo: '' };
const staffRoles = ['Receptionist', 'Cleaning Staff', 'Manager', 'Security', 'Accounts', 'Marketing', 'Maintenance', 'General Staff'];

export default function StaffPage({ params }: { params: { gymId: string } }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchStaff = () => {
    fetch(`/api/staff?gymId=${params.gymId}`).then(r => r.json()).then(d => { setStaff(d); setLoading(false); });
  };

  useEffect(() => { fetchStaff(); }, [params.gymId]);

  const handleOpen = (s?: Staff) => {
    if (s) {
      setEditing(s);
      setForm({ name: s.name, salary: String(s.salary), monthlyExpenditure: String(s.monthlyExpenditure), role: s.role, mobileNo: s.mobileNo || '' });
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
      await fetch(`/api/staff/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, gymId: params.gymId }) });
    }
    setSaving(false);
    handleClose();
    fetchStaff();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this staff member?')) return;
    await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    fetchStaff();
  };

  const totalSalary = staff.reduce((a, s) => a + s.salary, 0);
  const totalExpenditure = staff.reduce((a, s) => a + s.monthlyExpenditure, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">👥 Other Staff</h1>
          <p className="text-zinc-500 text-sm">{staff.length} staff member{staff.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => handleOpen()}>+ Add Staff</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Total Staff</p>
          <p className="text-2xl font-black text-white">{staff.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Monthly Salary</p>
          <p className="text-2xl font-black text-red-400">{formatCurrency(totalSalary)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Monthly Expenditure</p>
          <p className="text-2xl font-black text-orange-400">{formatCurrency(totalExpenditure)}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-lg font-semibold">No staff members yet</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-zinc-800">
              <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Salary</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Monthly Expenditure</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mobile</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="table-row-hover border-b border-zinc-800/50 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-sm font-bold text-emerald-400">{s.name.charAt(0)}</div>
                      <span className="text-sm font-semibold text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-400">{s.role}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{formatCurrency(s.salary)}</td>
                  <td className="px-5 py-4 text-sm text-orange-400 font-medium">{formatCurrency(s.monthlyExpenditure)}</td>
                  <td className="px-5 py-4 text-sm text-zinc-400">{s.mobileNo || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpen(s)}>✏️</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>🗑️</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} title={editing ? 'Edit Staff' : 'Add Staff Member'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Full Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="Suresh Kumar" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
              {staffRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Salary (₹/month) *</label>
              <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="18000" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Monthly Expenditure (₹)</label>
              <input type="number" value={form.monthlyExpenditure} onChange={e => setForm({ ...form, monthlyExpenditure: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="1200" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Mobile No</label>
            <input type="text" value={form.mobileNo} onChange={e => setForm({ ...form, mobileNo: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="+91 55443 22110" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Add'} Staff</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
