import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateEvaluationForReview } from '@/lib/ai-evaluation';

const reviewSchema = z.object({
  studentId: z.coerce.bigint(),
  classId: z.coerce.bigint().optional(),
  teacherId: z.coerce.bigint(),
  lessonDate: z.coerce.date(),
  currentRepertoire: z.string().optional(),
  currentTechniques: z.string().optional(),
  teachingContent: z.string().min(1),
  mainDifficulties: z.string().optional(),
  specificConfusion: z.string().optional(),
  homework: z.string().optional(),
  nextLessonSuggestion: z.string().optional(),
  instrumentPurchaseSignal: z.enum(['none', 'weak', 'medium', 'strong']).default('none'),
  renewalSignal: z.enum(['none', 'weak', 'medium', 'strong']).default('none'),
  churnRisk: z.enum(['low', 'medium', 'high']).default('low'),
  needAcademicFollowup: z.boolean().default(false),
  followupSuggestion: z.string().optional(),
  teacherExtraNotes: z.string().optional(),
});

export async function POST(request: Request, context: { params: { lessonId: string } }) {
  const lessonId = BigInt(context.params.lessonId);
  const body = await request.json();
  const data = reviewSchema.parse(body);

  const review = await prisma.lessonReview.create({
    data: {
      lessonId,
      studentId: data.studentId,
      classId: data.classId,
      teacherId: data.teacherId,
      lessonDate: data.lessonDate,
      currentRepertoire: data.currentRepertoire,
      currentTechniques: data.currentTechniques,
      teachingContent: data.teachingContent,
      mainDifficulties: data.mainDifficulties,
      specificConfusion: data.specificConfusion,
      homework: data.homework,
      nextLessonSuggestion: data.nextLessonSuggestion,
      instrumentPurchaseSignal: data.instrumentPurchaseSignal,
      renewalSignal: data.renewalSignal,
      churnRisk: data.churnRisk,
      needAcademicFollowup: data.needAcademicFollowup,
      followupSuggestion: data.followupSuggestion,
      teacherExtraNotes: data.teacherExtraNotes,
    },
  });

  await prisma.schedule.updateMany({
    where: { id: lessonId },
    data: { status: 'completed' },
  });

  const balance = await prisma.courseBalance.findFirst({
    where: { studentId: data.studentId },
  });

  if (balance) {
    await prisma.courseBalance.update({
      where: { id: balance.id },
      data: {
        usedLessons: Number(balance.usedLessons) + 1,
        remainingLessons: Math.max(Number(balance.remainingLessons) - 1, 0),
      },
    });
  }

  const evaluation = await generateEvaluationForReview(review.id);

  return NextResponse.json({ review, evaluation }, { status: 201 });
}
