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

  const staff = await prisma.staff.findMany({
    where: { gymId },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(staff);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, salary, monthlyExpenditure, role, gymId, mobileNo } = body;

  if (!name || !salary || !gymId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const staff = await prisma.staff.create({
    data: {
      name,
      salary: Number(salary),
      monthlyExpenditure: Number(monthlyExpenditure || 0),
      role: role || 'General Staff',
      gymId,
      mobileNo,
    },
  });

  return NextResponse.json(staff, { status: 201 });
}
