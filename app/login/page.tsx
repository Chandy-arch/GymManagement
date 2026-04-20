'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      // Fetch session to get role
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      if (session?.user?.role === 'TRAINER') {
        router.push('/trainer');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Background paint splashes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #e11d48 0%, transparent 70%)', top: '-200px', right: '-200px', transform: 'rotate(20deg)' }}
        />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(ellipse, #9f1239 0%, transparent 70%)', bottom: '-150px', left: '-150px', borderRadius: '60% 40% 70% 30%' }}
        />
        <div className="absolute w-[300px] h-[300px] opacity-5"
          style={{ background: 'radial-gradient(ellipse, #e11d48 0%, transparent 70%)', top: '40%', left: '60%', borderRadius: '40% 60% 30% 70%' }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(225,29,72,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
      </div>

      <div className="w-full max-w-md mx-4 relative z-10 animate-[fadeIn_0.5s_ease-out]">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 mb-4 shadow-[0_0_40px_rgba(225,29,72,0.4)]">
            <span className="text-4xl">💪</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            GymFit <span className="text-red-500">Pro</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-sm font-medium tracking-wide uppercase">
            Gym Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
          <p className="text-zinc-500 text-sm mb-8">Sign in to manage your gyms</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                placeholder="admin@gymfit.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="gym-input w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-zinc-600 text-xs text-center mb-4 font-medium uppercase tracking-wider">Demo Accounts</p>
            <div className="space-y-3">
              <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-medium">Owner</span>
                </div>
                <p className="text-zinc-300 text-xs font-mono">admin@gymfit.com</p>
                <p className="text-zinc-500 text-xs font-mono">GymFit@123</p>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">Trainer - Atom Fit</span>
                </div>
                <p className="text-zinc-300 text-xs font-mono">trainer1@atomfit.com</p>
                <p className="text-zinc-500 text-xs font-mono">Trainer@123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gym names at bottom */}
        <div className="flex justify-center gap-4 mt-8">
          {['Atom Fit', 'Pulse Fit', 'Power Fit', 'Impact Fit'].map((gym) => (
            <span key={gym} className="text-zinc-600 text-xs font-medium">{gym}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
