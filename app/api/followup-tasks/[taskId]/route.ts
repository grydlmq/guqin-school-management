import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const updateTaskSchema = z.object({
  status: z.enum(['pending', 'processing', 'done', 'paused', 'closed']).optional(),
  followupResult: z.string().optional(),
});

export async function PATCH(request: Request, context: { params: { taskId: string } }) {
  const taskId = BigInt(context.params.taskId);
  const body = await request.json();
  const data = updateTaskSchema.parse(body);

  const task = await prisma.followupTask.update({
    where: { id: taskId },
    data: {
      status: data.status,
      followupResult: data.followupResult,
      completedAt: data.status === 'done' ? new Date() : undefined,
    },
  });

  return NextResponse.json({ task });
}
