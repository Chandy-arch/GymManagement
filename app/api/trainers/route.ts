import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gymId = request.nextUrl.searchParams.get('gymId');
  if (!gymId) return NextResponse.json({ error: 'gymId required' }, { status: 400 });

  const trainers = await prisma.trainer.findMany({
    where: { gymId },
    include: {
      _count: { select: { members: true } },
      user: { select: { email: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(trainers);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, salary, experience, mobileNo, reportingTo, gymId, specialization } = body;

  if (!name || !salary || !experience || !mobileNo || !gymId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const trainer = await prisma.trainer.create({
    data: {
      name,
      salary: Number(salary),
      experience: Number(experience),
      mobileNo,
      reportingTo,
      gymId,
      specialization: specialization || 'General Fitness',
    },
  });

  return NextResponse.json(trainer, { status: 201 });
}
