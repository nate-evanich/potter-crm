import Link from "next/link";
import { Card, Empty } from "@/components/ui";
import { listProviders } from "@/lib/db/reviews";

function RatingBadge({ rating }: { rating: number | null }) {
  if (rating == null) return <span className="text-sm text-stone-500">No reviews yet</span>;
  return (
    <span
      className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-sm font-semibold text-amber-600"
      aria-label={`${rating.toFixed(1)} out of 10`}
    >
      {rating.toFixed(1)} / 10
    </span>
  );
}

export default async function ProvidersPage() {
  const providers = await listProviders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-wizard-900">Service providers</h1>
        <p className="text-sm text-stone-600">Browse practitioners and share your reviews.</p>
      </div>

      {providers.length === 0 ? (
        <Empty>No service providers are available yet.</Empty>
      ) : (
        <div className="space-y-3">
          {providers.map((p) => (
            <Link key={p.id} href={`/customer/providers/${p.id}`} className="block">
              <Card className="transition hover:border-wizard-300 hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-wizard-900">{p.displayName}</h2>
                    <p className="text-sm text-stone-600">
                      {p.reviewCount} {p.reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                  <Stars rating={p.averageRating} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
