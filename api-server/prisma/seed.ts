import { PrismaClient } from '@headless-gamify/prisma-client';

const prisma = new PrismaClient();

async function main() {
  const testCompanyId = '7b80350a-c8f8-40e0-aa4f-c814dd4c8d0b';
  const apiKey = 'B99683F3-1456CACE-56371890-D685B31C-1101F428-0C132514-20641C3D-815A4291';
  const company = await prisma.company.upsert({
    where: {
      id: testCompanyId,
    },
    update: {
      metadata: {
        apiKey: apiKey,
      },
    },
    create: {
      id: testCompanyId,
      metadata: {
        apiKey: apiKey,
      },
    },
  });

  // Add metrics
  const salesMetric = await prisma.metric.upsert({
    where: {
      name_companyId: {
        name: 'Sales',
        companyId: testCompanyId,
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
      companyId: testCompanyId,
    },
  });

  const supportMetric = await prisma.metric.upsert({
    where: {
      name_companyId: {
        name: 'Support Tickets',
        companyId: testCompanyId,
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
      companyId: testCompanyId,
    },
  });

  const salesTeam = await prisma.team.upsert({
    where: {
      name_companyId: {
        name: 'Sales Team',
        companyId: testCompanyId,
      },
    },
    update: {},
    create: {
      name: 'Sales Team',
      companyId: testCompanyId,
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
      companyId: testCompanyId,
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
      companyId: testCompanyId,
      teams: {
        connect: {
          id: salesTeam.id,
        },
      },
    },
  });

  console.log('company created', company);
  console.log('metrics created:', { salesMetric, supportMetric });
  console.log('team created:', salesTeam);
  console.log('users created:', { john, jane });
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
