import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import TrainerLayoutClient from '@/components/layout/TrainerLayoutClient';
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
    <TrainerLayoutClient
      trainerName={trainer?.name || session.user.name || 'Trainer'}
      gymName={trainer?.gym?.name || 'Your Gym'}
      userName={session.user.name || 'Trainer'}
    >
      {children}
    </TrainerLayoutClient>
  );
}
