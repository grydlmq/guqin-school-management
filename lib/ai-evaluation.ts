import { prisma } from './prisma';
import type { LessonReview } from '@prisma/client';

type EvaluationResult = {
  learningScore: number;
  enthusiasmScore: number;
  renewalProbability: 'low' | 'medium' | 'high';
  instrumentPurchaseProbability: 'low' | 'medium' | 'high';
  churnRisk: 'low' | 'medium' | 'high';
  currentMainProblem: string;
  teachingSuggestion: string;
  academicFollowupSuggestion: string;
  instrumentPurchaseSuggestion: string;
  renewalSuggestion: string;
  nextLessonFocus: string;
  riskWarning: string;
  suggestedTags: string[];
  followupTasks: Array<{
    taskType: 'renewal' | 'instrument_purchase' | 'churn_recovery' | 'trial_conversion' | 'material_reminder' | 'other';
    priority: 'low' | 'medium' | 'high';
    title: string;
    content: string;
    suggestedScript?: string;
  }>;
};

function buildLocalEvaluation(review: LessonReview): EvaluationResult {
  const hasPurchaseSignal = review.instrumentPurchaseSignal === 'medium' || review.instrumentPurchaseSignal === 'strong';
  const hasRenewalSignal = review.renewalSignal === 'medium' || review.renewalSignal === 'strong';
  const highRisk = review.churnRisk === 'high';

  const followupTasks: EvaluationResult['followupTasks'] = [];

  if (hasPurchaseSignal) {
    followupTasks.push({
      taskType: 'instrument_purchase',
      priority: review.instrumentPurchaseSignal === 'strong' ? 'high' : 'medium',
      title: '跟进学生购琴意向',
      content: '课后复盘中出现购琴信号，建议教务从练习效果和试琴体验角度轻度跟进。',
      suggestedScript: '老师反馈你最近学习状态不错，如果家里练习条件能跟上，进步会更稳定。可以先安排你试几张适合练习的琴，不急着决定。',
    });
  }

  if (hasRenewalSignal) {
    followupTasks.push({
      taskType: 'renewal',
      priority: review.renewalSignal === 'strong' ? 'high' : 'medium',
      title: '提前铺垫续课',
      content: '课后复盘中出现续课机会，建议教务结合学习阶段和剩余课时进行沟通。',
      suggestedScript: '你现在已经进入新的学习阶段，后面想把曲子完整弹下来，需要连续训练。老师建议接下来可以继续往下推进。',
    });
  }

  if (highRisk) {
    followupTasks.push({
      taskType: 'churn_recovery',
      priority: 'high',
      title: '高流失风险跟进',
      content: '老师标记学生存在较高流失风险，建议教务尽快了解原因。',
      suggestedScript: '最近学习安排上是不是遇到一些困难？我们可以一起调整节奏，让上课和练习更适合你的时间。',
    });
  }

  return {
    learningScore: highRisk ? 5 : 7,
    enthusiasmScore: review.churnRisk === 'low' ? 8 : 6,
    renewalProbability: hasRenewalSignal ? 'high' : 'medium',
    instrumentPurchaseProbability: hasPurchaseSignal ? 'high' : 'low',
    churnRisk: review.churnRisk,
    currentMainProblem: review.mainDifficulties || review.specificConfusion || '需要继续观察学生的主要学习困难。',
    teachingSuggestion: review.nextLessonSuggestion || '下节课建议先复习本节重点，再推进少量新内容，保证学生获得成就感。',
    academicFollowupSuggestion: review.needAcademicFollowup ? review.followupSuggestion || '建议教务跟进学生学习状态。' : '暂不需要强跟进，保持观察。',
    instrumentPurchaseSuggestion: hasPurchaseSignal ? '可以从练习条件和音色体验角度引导试琴，不建议直接强推成交。' : '暂不主动推进购琴，先观察学习稳定性。',
    renewalSuggestion: hasRenewalSignal ? '可以提前做续课铺垫，重点表达学习阶段升级，而不是只提醒课时不足。' : '继续观察学生进步感和满意度。',
    nextLessonFocus: review.nextLessonSuggestion || '稳定基础指法，帮助学生获得明确进步感。',
    riskWarning: highRisk ? '学生存在较高流失风险，需要尽快了解时间、练习、兴趣或价格方面的阻力。' : '暂无明显高风险。',
    suggestedTags: [
      ...(hasPurchaseSignal ? ['购琴机会'] : []),
      ...(hasRenewalSignal ? ['续课机会'] : []),
      ...(highRisk ? ['流失风险高'] : []),
    ],
    followupTasks,
  };
}

export async function generateEvaluationForReview(reviewId: bigint) {
  const review = await prisma.lessonReview.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error('课后复盘不存在');

  const result = buildLocalEvaluation(review);

  const evaluation = await prisma.aIStudentEvaluation.create({
    data: {
      lessonReviewId: review.id,
      lessonId: review.lessonId,
      studentId: review.studentId,
      teacherId: review.teacherId,
      learningScore: result.learningScore,
      enthusiasmScore: result.enthusiasmScore,
      renewalProbability: result.renewalProbability,
      instrumentPurchaseProbability: result.instrumentPurchaseProbability,
      churnRisk: result.churnRisk,
      currentMainProblem: result.currentMainProblem,
      teachingSuggestion: result.teachingSuggestion,
      academicFollowupSuggestion: result.academicFollowupSuggestion,
      instrumentPurchaseSuggestion: result.instrumentPurchaseSuggestion,
      renewalSuggestion: result.renewalSuggestion,
      nextLessonFocus: result.nextLessonFocus,
      riskWarning: result.riskWarning,
      suggestedTags: result.suggestedTags.join(','),
      suggestedFollowupTasks: result.followupTasks,
      rawAiResponse: result,
    },
  });

  for (const task of result.followupTasks) {
    await prisma.followupTask.create({
      data: {
        studentId: review.studentId,
        sourceType: 'ai',
        sourceId: evaluation.id,
        taskType: task.taskType,
        priority: task.priority,
        title: task.title,
        content: task.content,
        suggestedScript: task.suggestedScript,
      },
    });
  }

  await prisma.lessonReview.update({ where: { id: review.id }, data: { aiEvaluated: true } });

  return evaluation;
}
