import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import TrainerSidebar from '@/components/layout/TrainerSidebar';
import prisma from '@/lib/prisma';

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'TRAINER') redirect('/dashboard');

  const trainer = await prisma.trainer.findFirst({
    where: { user: { email: session.user.email! } },
    include: { gym: true },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Trainer header */}
      <header className="h-16 bg-zinc-950/90 border-b border-zinc-800/50 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <span className="text-lg">💪</span>
          </div>
          <div>
            <span className="text-lg font-black text-white">GymFit <span className="text-blue-400">Pro</span></span>
            <span className="text-xs text-zinc-500 ml-2">Trainer Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{session.user.name}</p>
            <p className="text-xs text-zinc-500">{trainer?.gym?.name || 'Trainer'}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-sm font-bold">
            {session.user.name?.charAt(0) || 'T'}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <TrainerSidebar
          trainerName={trainer?.name || session.user.name || 'Trainer'}
          gymName={trainer?.gym?.name || 'Your Gym'}
        />
        <main className="flex-1 overflow-auto page-enter">{children}</main>
      </div>
    </div>
  );
}
