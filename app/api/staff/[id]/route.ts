import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, salary, monthlyExpenditure, role, mobileNo, isActive } = body;

  const staff = await prisma.staff.update({
    where: { id: params.id },
    data: { name, salary: Number(salary), monthlyExpenditure: Number(monthlyExpenditure || 0), role, mobileNo, isActive },
  });

  return NextResponse.json(staff);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.staff.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
