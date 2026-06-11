import { prisma } from "@/lib/prisma";

export function listProviders() {
  return prisma.user.findMany({
    orderBy: { displayName: "asc" },
    select: {
      id: true,
      displayName: true,
      _count: { select: { reviews: true } },
      reviews: {
        select: { rating: true },
      },
    },
  });
}

export async function getProviderWithReviews(providerId: string) {
  const provider = await prisma.user.findUnique({
    where: { id: providerId },
    select: {
      id: true,
      displayName: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          customer: { select: { displayName: true } },
        },
      },
    },
  });
  return provider ?? null;
}

export function getCustomerReview(customerId: string, providerId: string) {
  return prisma.review.findUnique({
    where: { customerId_providerId: { customerId, providerId } },
    select: { rating: true, comment: true },
  });
}

export function upsertReview(
  customerId: string,
  providerId: string,
  data: { rating: number; comment: string },
) {
  return prisma.review.upsert({
    where: { customerId_providerId: { customerId, providerId } },
    create: { customerId, providerId, rating: data.rating, comment: data.comment },
    update: { rating: data.rating, comment: data.comment },
  });
}
