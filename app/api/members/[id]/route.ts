import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const member = await prisma.member.findUnique({
    where: { id: params.id },
    include: { personalTrainer: { select: { id: true, name: true, specialization: true } } },
  });

  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, ageGroup, gender, fitnessGoal, experienceLevel, motivationLevel, personality, membershipPlan, personalTrainerId, healthConditions, mobileNo, email, isActive } = body;

  const member = await prisma.member.update({
    where: { id: params.id },
    data: {
      name, ageGroup, gender, fitnessGoal, experienceLevel, motivationLevel,
      personality, membershipPlan,
      personalTrainerId: personalTrainerId || null,
      healthConditions: JSON.stringify(healthConditions || []),
      mobileNo, email, isActive,
    },
  });

  return NextResponse.json(member);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.member.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
