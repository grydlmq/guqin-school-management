import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.classroom.createMany({
    data: [
      { name: '一号教室', capacity: 2 },
      { name: '二号教室', capacity: 2 },
      { name: '三号教室', capacity: 2 },
      { name: '四号教室', capacity: 2 },
      { name: '五号教室', capacity: 2 },
    ],
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: [
      { name: '系统管理员', phone: 'admin', role: 'admin' },
      { name: '教务老师', phone: 'academic', role: 'academic' },
      { name: '普通老师', phone: 'teacher', role: 'teacher' },
    ],
    skipDuplicates: true,
  });

  await prisma.student.createMany({
    data: [
      { name: '张三', phone: '13800000001', sourceChannel: '朋友介绍', mainStatus: 'studying', learningStatus: 'formal', instrumentStatus: 'interested' },
      { name: '李四', phone: '13800000002', sourceChannel: '小红书', mainStatus: 'pre_sale', preSaleStage: 'trial_scheduled', learningStatus: 'trial' },
      { name: '王五', phone: '13800000003', sourceChannel: '到店咨询', mainStatus: 'pre_sale', preSaleStage: 'new_lead' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
