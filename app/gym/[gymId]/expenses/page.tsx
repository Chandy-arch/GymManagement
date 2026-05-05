'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES } from '@/lib/utils';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string | null;
}

const emptyForm = { title: '', amount: '', category: 'Utilities', description: '', date: new Date().toISOString().split('T')[0] };

const categoryColors: Record<string, string> = {
  Equipment: 'text-blue-400 bg-blue-400/10',
  Salary: 'text-purple-400 bg-purple-400/10',
  Utilities: 'text-yellow-400 bg-yellow-400/10',
  Marketing: 'text-emerald-400 bg-emerald-400/10',
  Maintenance: 'text-orange-400 bg-orange-400/10',
  Other: 'text-zinc-400 bg-zinc-400/10',
};

export default function ExpensesPage({ params }: { params: { gymId: string } }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');

  const fetchExpenses = () => {
    fetch(`/api/expenses?gymId=${params.gymId}`).then(r => r.json()).then(d => { setExpenses(d); setLoading(false); });
  };

  useEffect(() => { fetchExpenses(); }, [params.gymId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, gymId: params.gymId }) });
    setSaving(false);
    setIsOpen(false);
    setForm(emptyForm);
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
    fetchExpenses();
  };

  const filtered = filterCategory ? expenses.filter(e => e.category === filterCategory) : expenses;
  const total = filtered.reduce((a, e) => a + e.amount, 0);

  // Category breakdown
  const byCategory = EXPENSE_CATEGORIES.map(cat => ({
    name: cat,
    amount: expenses.filter(e => e.category === cat).reduce((a, e) => a + e.amount, 0),
    count: expenses.filter(e => e.category === cat).length,
  })).filter(c => c.count > 0);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">💰 Expense Tracker</h1>
          <p className="text-zinc-500 text-sm">{expenses.length} expense records</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>+ Add Expense</Button>
      </div>

      {/* Total + Category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-950/30 to-zinc-900 border border-red-800/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-1">Total Expenses</p>
          <p className="text-4xl font-black text-white">{formatCurrency(expenses.reduce((a, e) => a + e.amount, 0))}</p>
          <p className="text-zinc-500 text-xs mt-2">{expenses.length} transactions</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-sm font-semibold text-zinc-400 mb-3">By Category</p>
          <div className="space-y-2">
            {byCategory.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[c.name] || 'text-zinc-400 bg-zinc-400/10'}`}>{c.name}</span>
                <span className="text-sm font-bold text-white">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="gym-input bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {filterCategory && (
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5">
            <span className="text-sm text-zinc-400">Filtered total:</span>
            <span className="text-sm font-bold text-white">{formatCurrency(total)}</span>
          </div>
        )}
      </div>

      {/* Expense list */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-4xl mb-3">💰</p>
          <p>No expenses recorded yet</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-zinc-800">
              {['Title', 'Category', 'Amount', 'Date', 'Description', ''].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="table-row-hover border-b border-zinc-800/50 last:border-0">
                  <td className="px-5 py-4 text-sm font-semibold text-white">{e.title}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[e.category] || 'text-zinc-400 bg-zinc-400/10'}`}>{e.category}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-red-400">{formatCurrency(e.amount)}</td>
                  <td className="px-5 py-4 text-sm text-zinc-400">{formatDate(e.date)}</td>
                  <td className="px-5 py-4 text-sm text-zinc-500 max-w-48 truncate">{e.description || '—'}</td>
                  <td className="px-5 py-4">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(e.id)}>🗑️</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setForm(emptyForm); }} title="Add Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="Electricity Bill" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Amount (₹) *</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" placeholder="12000" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Category *</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2} className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none" placeholder="Additional details..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setIsOpen(false); setForm(emptyForm); }} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Add Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
