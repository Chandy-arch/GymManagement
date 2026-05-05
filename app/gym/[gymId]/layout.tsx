import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import GymLayoutClient from '@/components/layout/GymLayoutClient';
import prisma from '@/lib/prisma';

export default async function GymLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { gymId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const gym = await prisma.gym.findUnique({ where: { id: params.gymId } });
  if (!gym) redirect('/dashboard');

  return (
    <GymLayoutClient gymId={params.gymId} gymName={gym.name}>
      {children}
    </GymLayoutClient>
  );
}
