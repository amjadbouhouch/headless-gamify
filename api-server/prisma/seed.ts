import { PrismaClient } from '@headless-gamify/prisma-client';

const prisma = new PrismaClient();

async function main() {
  console.log('start seeding...');
  const companyId = '7b80350a-c8f8-40e0-aa4f-c814dd4c8d0b';
  const apiKey = 'B99683F3-1456CACE-56371890-D685B31C-1101F428-0C132514-20641C3D-815A4291';
  const company = await prisma.company.upsert({
    where: {
      id: companyId,
    },
    update: {
      metadata: {
        apiKey: apiKey,
      },
    },
    create: {
      id: companyId,
      metadata: {
        apiKey: apiKey,
      },
    },
  });

  // Add metrics
  const checklistMetric = await prisma.metric.upsert({
    where: {
      name_companyId: {
        name: 'Checklist completed',
        companyId: companyId,
      },
    },
    create: {
      name: 'Checklist completed',
      defaultGainXP: 10,
      companyId: companyId,
    },
    update: {},
  });

  const openAppMetric = await prisma.metric.upsert({
    where: {
      name_companyId: {
        name: 'App Opened',
        companyId: companyId,
      },
    },
    create: {
      name: 'App Opened',
      companyId: companyId,
    },
    update: {},
  });

  const salesMetric = await prisma.metric.upsert({
    where: {
      name_companyId: {
        name: 'Sales',
        companyId: companyId,
      },
    },
    update: {
      defaultGainXP: 10,
      description: 'Track sales performance',
    },
    create: {
      name: 'Sales',
      description: 'Track sales performance',
      defaultGainXP: 10,
      companyId: companyId,
    },
  });

  const supportMetric = await prisma.metric.upsert({
    where: {
      name_companyId: {
        name: 'Support Tickets',
        companyId: companyId,
      },
    },
    update: {
      defaultGainXP: 5,
      description: 'Track resolved support tickets',
    },
    create: {
      name: 'Support Tickets',
      description: 'Track resolved support tickets',
      defaultGainXP: 5,
      companyId: companyId,
    },
  });

  const salesTeam = await prisma.team.upsert({
    where: {
      name_companyId: {
        name: 'Sales Team',
        companyId: companyId,
      },
    },
    update: {},
    create: {
      name: 'Sales Team',
      companyId: companyId,
    },
  });

  const user1Id = '1b80350a-c8f8-40e0-aa4f-c814dd4c8d0c';
  const user2Id = '2b80350a-c8f8-40e0-aa4f-c814dd4c8d0d';

  const john = await prisma.user.upsert({
    where: {
      id: user1Id,
    },
    update: {
      teams: {
        connect: {
          id: salesTeam.id,
        },
      },
    },
    create: {
      id: user1Id,
      xp: 0,
      level: 1,
      companyId: companyId,
      teams: {
        connect: {
          id: salesTeam.id,
        },
      },
      metadata: {},
    },
  });

  const jane = await prisma.user.upsert({
    where: {
      id: user2Id,
    },
    update: {
      teams: {
        connect: {
          id: salesTeam.id,
        },
      },
    },
    create: {
      id: user2Id,
      xp: 0,
      level: 1,
      companyId: companyId,
      teams: {
        connect: {
          id: salesTeam.id,
        },
      },
    },
  });

  //  const
  const objectiveId = '29b46972-2f9a-405d-9a6a-68e06cee34df';

  const dailyObjective = await prisma.objective.upsert({
    where: {
      id: objectiveId,
    },
    create: {
      id: objectiveId,
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      startDate: new Date(),
      name: `Daily App Usage`,
      targetValue: 10,
      rewardXp: 10,
      metricId: openAppMetric.id,
      type: 'solo',
      companyId,
      users: {
        connect: [
          {
            id: user1Id,
          },
          {
            id: user2Id,
          },
        ],
      },
    },
    update: {},
  });

  const rewardId = 'ed049cb8-8df2-46eb-b8a6-075a4b75a50b';

  const reward = await prisma.reward.upsert({
    where: {
      id: rewardId,
    },
    create: {
      name: 'performance-bonus',
      companyId,
      xpThreshold: 50,
      description: 'Monthly bonus for top performers',
    },
    update: {},
  });
  const badgeId = 'bb19ac3e-7405-4d08-92fa-a5bedc3df929';

  await prisma.badge.upsert({
    where: {
      name_companyId: {
        companyId,
        name: 'Welcome badge',
      },
    },
    create: {
      companyId,
      name: 'Welcome badge',
      conditions: {
        connectOrCreate: {
          where: {
            id: '056f1d1f-eefa-4c38-8184-fea797d353a4',
          },
          create: {
            id: '056f1d1f-eefa-4c38-8184-fea797d353a4',
            operator: 'gte',
            priority: 1,
            type: 'firstEvent',
            metricId: openAppMetric.id,
          },
        },
      },
    },
    update: {},
  });
  console.log('done seeding 🚀');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
