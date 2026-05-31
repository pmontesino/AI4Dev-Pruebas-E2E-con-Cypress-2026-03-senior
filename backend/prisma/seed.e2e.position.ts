import { PrismaClient } from '@prisma/client';

const E2E_COMPANY_NAME = 'LTI E2E Company';
const E2E_RECRUITER_EMAIL = 'recruiter.e2e@lti.com';
const E2E_POSITION_TITLE = 'E2E Position - Position Page Load';
const E2E_FLOW_DESCRIPTION = 'E2E deterministic interview flow for position page';

const E2E_CANDIDATES = [
  {
    firstName: 'Ana',
    lastName: 'Gomez',
    email: 'ana.gomez.e2e@lti.com',
    stageName: 'Initial Screening',
  },
  {
    firstName: 'Bruno',
    lastName: 'Diaz',
    email: 'bruno.diaz.e2e@lti.com',
    stageName: 'Technical Interview',
  },
  {
    firstName: 'Carla',
    lastName: 'Ruiz',
    email: 'carla.ruiz.e2e@lti.com',
    stageName: 'Manager Interview',
  },
  {
    firstName: 'Diego',
    lastName: 'Mora',
    email: 'diego.mora.e2e@lti.com',
    stageName: 'Technical Interview',
  },
];

const E2E_STAGES = [
  'Initial Screening',
  'Technical Interview',
  'Manager Interview',
  'Final Decision',
];

export async function runE2EPositionSeed(prismaClient?: PrismaClient) {
  const prisma = prismaClient ?? new PrismaClient();
  const ownsClient = !prismaClient;

  try {
    const company = await prisma.company.upsert({
      where: { name: E2E_COMPANY_NAME },
      update: {},
      create: { name: E2E_COMPANY_NAME },
    });

    const recruiter = await prisma.employee.upsert({
      where: { email: E2E_RECRUITER_EMAIL },
      update: {
        name: 'Recruiter E2E',
        role: 'Recruiter',
        isActive: true,
        companyId: company.id,
      },
      create: {
        name: 'Recruiter E2E',
        email: E2E_RECRUITER_EMAIL,
        role: 'Recruiter',
        isActive: true,
        companyId: company.id,
      },
    });

    const existingPositions = await prisma.position.findMany({
      where: { title: E2E_POSITION_TITLE },
      select: { id: true },
    });

    const existingPositionIds = existingPositions.map((position) => position.id);

    if (existingPositionIds.length > 0) {
      await prisma.interview.deleteMany({
        where: {
          application: {
            positionId: { in: existingPositionIds },
          },
        },
      });

      await prisma.application.deleteMany({
        where: {
          positionId: { in: existingPositionIds },
        },
      });

      await prisma.position.deleteMany({
        where: {
          id: { in: existingPositionIds },
        },
      });
    }

    await prisma.candidate.deleteMany({
      where: {
        email: {
          in: E2E_CANDIDATES.map((candidate) => candidate.email),
        },
      },
    });

    const oldFlows = await prisma.interviewFlow.findMany({
      where: { description: E2E_FLOW_DESCRIPTION },
      select: { id: true },
    });

    const oldFlowIds = oldFlows.map((flow) => flow.id);
    if (oldFlowIds.length > 0) {
      await prisma.interviewStep.deleteMany({
        where: {
          interviewFlowId: {
            in: oldFlowIds,
          },
        },
      });

      await prisma.interviewFlow.deleteMany({
        where: {
          id: {
            in: oldFlowIds,
          },
        },
      });
    }

    const [phoneScreen, techInterview, managerInterview, finalDecision] = await Promise.all([
      prisma.interviewType.create({ data: { name: 'Phone Screen E2E' } }),
      prisma.interviewType.create({ data: { name: 'Technical Interview E2E' } }),
      prisma.interviewType.create({ data: { name: 'Manager Interview E2E' } }),
      prisma.interviewType.create({ data: { name: 'Final Decision E2E' } }),
    ]);

    const flow = await prisma.interviewFlow.create({
      data: {
        description: E2E_FLOW_DESCRIPTION,
      },
    });

    const steps = await Promise.all(
      E2E_STAGES.map((stageName, index) => {
        const interviewTypeId = [phoneScreen.id, techInterview.id, managerInterview.id, finalDecision.id][index];

        return prisma.interviewStep.create({
          data: {
            interviewFlowId: flow.id,
            interviewTypeId,
            orderIndex: index + 1,
            name: stageName,
          },
        });
      })
    );

    const stepsByName = new Map(steps.map((step) => [step.name, step]));

    const position = await prisma.position.create({
      data: {
        title: E2E_POSITION_TITLE,
        description: 'Position used by Cypress E2E tests for deterministic page-load assertions.',
        location: 'Remote',
        jobDescription: 'E2E position testing card and pipeline rendering.',
        responsibilities: 'Validate stages and candidate mapping by current interview step id.',
        salaryMin: 35000,
        salaryMax: 55000,
        status: 'Open',
        companyId: company.id,
        interviewFlowId: flow.id,
        isVisible: true,
      },
    });

    for (const candidateInfo of E2E_CANDIDATES) {
      const candidate = await prisma.candidate.create({
        data: {
          firstName: candidateInfo.firstName,
          lastName: candidateInfo.lastName,
          email: candidateInfo.email,
        },
      });

      const step = stepsByName.get(candidateInfo.stageName);
      if (!step) {
        throw new Error(`Interview step not found for stage ${candidateInfo.stageName}`);
      }

      const application = await prisma.application.create({
        data: {
          candidateId: candidate.id,
          positionId: position.id,
          applicationDate: new Date(),
          currentInterviewStep: step.id,
        },
      });

      await prisma.interview.create({
        data: {
          applicationId: application.id,
          interviewStepId: step.id,
          employeeId: recruiter.id,
          interviewDate: new Date(),
          score: 8,
          notes: 'E2E deterministic seed interview',
        },
      });
    }

    return {
      companyId: company.id,
      recruiterId: recruiter.id,
      positionId: position.id,
    };
  } finally {
    if (ownsClient) {
      await prisma.$disconnect();
    }
  }
}

if (require.main === module) {
  runE2EPositionSeed()
    .then((result) => {
      console.log('E2E seed completed:', result);
    })
    .catch((error) => {
      console.error('E2E seed failed:', error);
      process.exit(1);
    });
}
