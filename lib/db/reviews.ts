import { prisma } from "@/lib/prisma";

export function listProviders(userId: string) {
  return prisma.provider.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { reviews: true } },
      reviews: { select: { rating: true } },
    },
  });
}

export function getProvider(userId: string, id: string) {
  return prisma.provider.findFirst({
    where: { id, userId },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { displayName: true } } },
      },
    },
  });
}

export function createProvider(userId: string, data: { name: string; description?: string }) {
  return prisma.provider.create({ data: { userId, ...data } });
}

export function getReviewByUser(providerId: string, userId: string) {
  return prisma.review.findUnique({ where: { providerId_userId: { providerId, userId } } });
}

export async function upsertReview(
  userId: string,
  providerId: string,
  data: { rating: number; body?: string },
) {
  // Verify the provider belongs to this user.
  const provider = await prisma.provider.findFirst({ where: { id: providerId, userId } });
  if (!provider) throw new Error("Provider not found");

  return prisma.review.upsert({
    where: { providerId_userId: { providerId, userId } },
    create: { providerId, userId, rating: data.rating, body: data.body },
    update: { rating: data.rating, body: data.body },
  });
}

export function averageRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return sum / reviews.length;
}
