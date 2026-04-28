import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gymId = request.nextUrl.searchParams.get('gymId');
  const trainerId = request.nextUrl.searchParams.get('trainerId');

  const where: Record<string, unknown> = {};
  if (gymId) where.gymId = gymId;
  if (trainerId) where.personalTrainerId = trainerId;

  const members = await prisma.member.findMany({
    where,
    include: {
      personalTrainer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const {
    name, ageGroup, gender, fitnessGoal, experienceLevel, motivationLevel,
    personality, membershipPlan, personalTrainerId, gymId, healthConditions,
    mobileNo, email,
  } = body;

  if (!name || !ageGroup || !gender || !fitnessGoal || !gymId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const member = await prisma.member.create({
    data: {
      name,
      ageGroup,
      gender,
      fitnessGoal,
      experienceLevel: experienceLevel || 'Beginner',
      motivationLevel: motivationLevel || 'Goal-Oriented',
      personality: personality || 'Solo Trainer',
      membershipPlan: membershipPlan || 'Monthly',
      personalTrainerId: personalTrainerId || null,
      gymId,
      healthConditions: JSON.stringify(healthConditions || []),
      mobileNo,
      email,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
