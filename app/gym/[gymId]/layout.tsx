import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Header from '@/components/layout/Header';
import GymSidebar from '@/components/layout/GymSidebar';
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <GymSidebar gymId={params.gymId} gymName={gym.name} />
        <main className="flex-1 overflow-auto page-enter">{children}</main>
      </div>
    </div>
  );
}
