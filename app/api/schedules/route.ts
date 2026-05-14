import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { assertNoScheduleConflicts } from '@/lib/schedule-conflicts';

const createScheduleSchema = z.object({
  scheduleType: z.enum(['formal', 'trial', 'make_up', 'activity', 'other']).default('formal'),
  studentId: z.coerce.bigint().optional(),
  classId: z.coerce.bigint().optional(),
  teacherId: z.coerce.bigint(),
  classroomId: z.coerce.bigint(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  deductLessons: z.boolean().default(true),
  note: z.string().optional(),
});

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { startTime: 'asc' },
    take: 200,
    include: { student: true, class: true, classroom: true },
  });

  return NextResponse.json({ schedules });
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = createScheduleSchema.parse(body);

  if (data.endTime <= data.startTime) {
    return NextResponse.json({ error: '结束时间必须晚于开始时间' }, { status: 400 });
  }

  try {
    await assertNoScheduleConflicts({
      teacherId: data.teacherId,
      classroomId: data.classroomId,
      classId: data.classId,
      startTime: data.startTime,
      endTime: data.endTime,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '排课冲突' }, { status: 409 });
  }

  const schedule = await prisma.schedule.create({ data });
  return NextResponse.json({ schedule }, { status: 201 });
}
