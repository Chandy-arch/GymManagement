import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, yearOfManufacture, price, condition } = body;

  const equipment = await prisma.equipment.update({
    where: { id: params.id },
    data: {
      name,
      yearOfManufacture: Number(yearOfManufacture),
      price: Number(price),
      condition,
    },
  });

  return NextResponse.json(equipment);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.equipment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
