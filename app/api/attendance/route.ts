import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gymId = request.nextUrl.searchParams.get('gymId');
  const type = request.nextUrl.searchParams.get('type'); // TRAINER or MEMBER
  const date = request.nextUrl.searchParams.get('date');

  const where: Record<string, unknown> = {};
  if (gymId) where.gymId = gymId;
  if (type) where.type = type;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      trainer: { select: { id: true, name: true } },
      member: { select: { id: true, name: true } },
    },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(attendance);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { type, trainerId, memberId, gymId, status, checkInTime, checkOutTime, date, notes } = body;

  if (!type || !gymId || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const attendance = await prisma.attendance.create({
    data: {
      type,
      trainerId: trainerId || null,
      memberId: memberId || null,
      gymId,
      status,
      checkInTime,
      checkOutTime,
      date: date ? new Date(date) : new Date(),
      notes,
    },
    include: {
      trainer: { select: { id: true, name: true } },
      member: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(attendance, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, checkOutTime, status, notes } = body;

  const attendance = await prisma.attendance.update({
    where: { id },
    data: { checkOutTime, status, notes },
  });

  return NextResponse.json(attendance);
}
