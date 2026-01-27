import { prisma } from './prisma';
import { PLANS } from './stripe';

export async function checkScanLimit(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planType: true, subscriptionStatus: true },
  });

  const plan = user?.subscriptionStatus === 'active' ? PLANS.pro : PLANS.free;

  if (plan.scansPerMonth === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const scanCount = await prisma.scan.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });

  const remaining = Math.max(0, plan.scansPerMonth - scanCount);
  return {
    allowed: scanCount < plan.scansPerMonth,
    remaining,
    limit: plan.scansPerMonth,
  };
}

export async function recordScan(userId: string, data: {
  healthScore: number;
  analysis: string;
  ingredients: string[];
  pros: string[];
  cons: string[];
}) {
  return prisma.scan.create({
    data: {
      userId,
      healthScore: data.healthScore,
      analysis: data.analysis,
      ingredients: JSON.stringify(data.ingredients),
      pros: JSON.stringify(data.pros),
      cons: JSON.stringify(data.cons),
    },
  });
}

export async function getUserScans(userId: string, limit = 20) {
  const scans = await prisma.scan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return scans.map((scan) => ({
    ...scan,
    ingredients: JSON.parse(scan.ingredients),
    pros: JSON.parse(scan.pros),
    cons: JSON.parse(scan.cons),
  }));
}
