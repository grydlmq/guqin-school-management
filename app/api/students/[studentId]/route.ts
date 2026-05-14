import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, context: { params: { studentId: string } }) {
  const studentId = BigInt(context.params.studentId);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      courseBalances: true,
      lessonReviews: { orderBy: { createdAt: 'desc' }, take: 20 },
      evaluations: { orderBy: { createdAt: 'desc' }, take: 20 },
      followupTasks: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!student) {
    return NextResponse.json({ error: '学生不存在' }, { status: 404 });
  }

  return NextResponse.json({ student });
}
