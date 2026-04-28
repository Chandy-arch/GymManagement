import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'TRAINER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const trainer = await prisma.trainer.findFirst({
    where: { user: { email: session.user.email! } },
    include: {
      gym: true,
      members: {
        include: { personalTrainer: { select: { name: true } } },
      },
    },
  });

  if (!trainer) return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
  return NextResponse.json(trainer);
}
