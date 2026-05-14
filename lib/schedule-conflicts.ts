import { prisma } from './prisma';

type ConflictInput = {
  teacherId: bigint;
  classroomId: bigint;
  classId?: bigint | null;
  startTime: Date;
  endTime: Date;
  excludeScheduleId?: bigint;
};

export async function findScheduleConflicts(input: ConflictInput) {
  const timeOverlap = {
    startTime: { lt: input.endTime },
    endTime: { gt: input.startTime },
  };

  const notSelf = input.excludeScheduleId
    ? { id: { not: input.excludeScheduleId } }
    : {};

  const conflicts = await prisma.schedule.findMany({
    where: {
      status: 'scheduled',
      ...notSelf,
      OR: [
        { classroomId: input.classroomId, ...timeOverlap },
        { teacherId: input.teacherId, ...timeOverlap },
        ...(input.classId ? [{ classId: input.classId, ...timeOverlap }] : []),
      ],
    },
    select: {
      id: true,
      scheduleType: true,
      teacherId: true,
      classroomId: true,
      classId: true,
      startTime: true,
      endTime: true,
    },
  });

  return conflicts;
}

export async function assertNoScheduleConflicts(input: ConflictInput) {
  const conflicts = await findScheduleConflicts(input);
  if (conflicts.length > 0) {
    throw new Error('排课冲突：同一时间老师、教室或班级已被占用');
  }
}
