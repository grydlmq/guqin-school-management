import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createStudentSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  wechat: z.string().optional(),
  sourceChannel: z.string().optional(),
  assignedTeacherId: z.coerce.bigint().optional(),
  assignedAcademicId: z.coerce.bigint().optional(),
  note: z.string().optional(),
});

export async function GET() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      courseBalances: true,
      followupTasks: { where: { status: 'pending' }, take: 5 },
    },
  });

  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = createStudentSchema.parse(body);

  const student = await prisma.student.create({
    data: {
      name: data.name,
      phone: data.phone,
      wechat: data.wechat,
      sourceChannel: data.sourceChannel,
      assignedTeacherId: data.assignedTeacherId,
      assignedAcademicId: data.assignedAcademicId,
      note: data.note,
    },
  });

  return NextResponse.json({ student }, { status: 201 });
}
