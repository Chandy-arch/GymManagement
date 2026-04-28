import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gyms = await prisma.gym.findMany({
    include: {
      _count: {
        select: { members: true, trainers: true, staff: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(gyms);
}
