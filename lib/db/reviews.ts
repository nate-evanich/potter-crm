import { prisma } from "@/lib/prisma";

export type ProviderSummary = {
  id: string;
  displayName: string;
  reviewCount: number;
  averageRating: number | null;
};

// List all service providers (practitioners) with their review stats.
export async function listProviders(): Promise<ProviderSummary[]> {
  const providers = await prisma.user.findMany({
    orderBy: { displayName: "asc" },
    select: {
      id: true,
      displayName: true,
      reviews: { select: { rating: true } },
    },
  });

  return providers.map((p) => {
    const reviewCount = p.reviews.length;
    const averageRating =
      reviewCount === 0
        ? null
        : p.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
    return { id: p.id, displayName: p.displayName, reviewCount, averageRating };
  });
}

// A single provider with their reviews (newest first) and review stats.
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

  if (!provider) return null;

  const reviewCount = provider.reviews.length;
  const averageRating =
    reviewCount === 0
      ? null
      : provider.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

  return { ...provider, reviewCount, averageRating };
}

// The review a given customer has already left for a provider, if any.
export function getCustomerReview(customerId: string, providerId: string) {
  return prisma.review.findUnique({
    where: { customerId_providerId: { customerId, providerId } },
  });
}

// Create or update a customer's review for a provider.
export function upsertReview(
  customerId: string,
  providerId: string,
  data: { rating: number; comment: string | null },
) {
  return prisma.review.upsert({
    where: { customerId_providerId: { customerId, providerId } },
    create: { customerId, providerId, ...data },
    update: data,
  });
}
