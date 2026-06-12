import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Empty } from "@/components/ui";
import { ReviewForm } from "@/components/forms/review-form";
import { requireCustomer } from "@/lib/auth";
import { getCustomerReview, getProviderWithReviews } from "@/lib/db/reviews";

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-sm font-semibold text-amber-600"
      aria-label={`${rating.toFixed(1)} out of 10`}
    >
      {rating.toFixed(1)} / 10
    </span>
  );
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;
  const customer = await requireCustomer();

  const provider = await getProviderWithReviews(providerId);
  if (!provider) notFound();

  const myReview = await getCustomerReview(customer.id, providerId);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/customer/providers" className="text-sm text-stone-600 hover:underline">
          ← All providers
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-wizard-900">{provider.displayName}</h1>
        <div className="text-right text-sm text-stone-600">
          {provider.averageRating == null ? (
            "No reviews yet"
          ) : (
            <span className="flex items-center gap-2">
              <RatingBadge rating={provider.averageRating} />
              <span>({provider.reviewCount})</span>
            </span>
          )}
        </div>
      </div>

      <Card>
        <h2 className="mb-1 text-lg font-semibold text-wizard-900">
          {myReview ? "Your review" : "Write a review"}
        </h2>
        <p className="mb-4 text-sm text-stone-600">
          {myReview
            ? "You can update your review at any time."
            : "Share your experience with this service provider."}
        </p>
        <ReviewForm
          providerId={provider.id}
          initial={myReview ? { rating: myReview.rating, comment: myReview.comment } : null}
        />
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-wizard-900">Reviews</h2>
        {provider.reviews.length === 0 ? (
          <Empty>No reviews yet. Be the first to leave one.</Empty>
        ) : (
          provider.reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-stone-800">
                  {review.customer.displayName}
                </span>
                <Stars rating={review.rating} />
              </div>
              {review.comment && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-700">{review.comment}</p>
              )}
              <p className="mt-2 text-xs text-stone-400">
                {review.createdAt.toLocaleDateString()}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
