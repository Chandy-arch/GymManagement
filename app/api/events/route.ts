import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gymId = request.nextUrl.searchParams.get('gymId');
  if (!gymId) return NextResponse.json({ error: 'gymId required' }, { status: 400 });

  const events = await prisma.event.findMany({
    where: { gymId },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, description, date, targetAudience, gymId } = body;

  if (!title || !description || !date || !targetAudience || !gymId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      targetAudience,
      gymId,
    },
  });

  return NextResponse.json(event, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
