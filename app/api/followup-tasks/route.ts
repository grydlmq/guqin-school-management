import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createTaskSchema = z.object({
  studentId: z.coerce.bigint(),
  taskType: z.enum(['renewal', 'instrument_purchase', 'churn_recovery', 'trial_conversion', 'material_reminder', 'other']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  title: z.string().min(1),
  content: z.string().optional(),
  suggestedScript: z.string().optional(),
  assigneeId: z.coerce.bigint().optional(),
  dueDate: z.coerce.date().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const taskType = searchParams.get('taskType');

  const tasks = await prisma.followupTask.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(taskType ? { taskType: taskType as any } : {}),
    },
    include: { student: true },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    take: 200,
  });

  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = createTaskSchema.parse(body);

  const task = await prisma.followupTask.create({
    data: {
      studentId: data.studentId,
      sourceType: 'manual',
      taskType: data.taskType,
      priority: data.priority,
      title: data.title,
      content: data.content,
      suggestedScript: data.suggestedScript,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
