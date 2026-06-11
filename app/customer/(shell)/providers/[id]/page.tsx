import { notFound } from "next/navigation";
import { requireCustomer } from "@/lib/auth";
import { getProviderWithReviews, getCustomerReview } from "@/lib/db/reviews";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";
import { ReviewForm } from "@/components/forms/review-form";

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await requireCustomer();
  const provider = await getProviderWithReviews(id);
  if (!provider) notFound();

  const existing = await getCustomerReview(customer.id, provider.id);

  const reviewCount = provider.reviews.length;
  const avg =
    reviewCount > 0
      ? (provider.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : null;

  return (
    <>
      <PageHeader
        title={provider.displayName}
        subtitle={
          avg !== null
            ? `Average: ${avg} / 10 (${reviewCount} ${reviewCount === 1 ? "review" : "reviews"})`
            : "No reviews yet."
        }
      />

      <Card className="mb-8">
        <h2 className="text-base font-semibold text-stone-800 mb-4">
          {existing ? "Update your review" : "Leave a review"}
        </h2>
        <ReviewForm
          providerId={provider.id}
          initial={existing ? { rating: existing.rating, comment: existing.comment } : null}
        />
      </Card>

      {reviewCount > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-stone-800">All reviews</h2>
          {provider.reviews.map((review) => (
            <Card key={review.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-800">
                  {review.customer.displayName}
                </span>
                <span className="text-sm text-stone-600">
                  {review.rating} / 10
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {review.comment ? (
                <p className="text-sm text-stone-700 pt-1">{review.comment}</p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
