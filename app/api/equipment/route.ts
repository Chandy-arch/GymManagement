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

  const equipment = await prisma.equipment.findMany({
    where: { gymId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(equipment);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, yearOfManufacture, price, gymId, condition } = body;

  if (!name || !yearOfManufacture || !price || !gymId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const equipment = await prisma.equipment.create({
    data: {
      name,
      yearOfManufacture: Number(yearOfManufacture),
      price: Number(price),
      gymId,
      condition: condition || 'Good',
    },
  });

  return NextResponse.json(equipment, { status: 201 });
}
