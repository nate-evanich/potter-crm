import Link from "next/link";
import { requireCustomer } from "@/lib/auth";
import { listProviders } from "@/lib/db/reviews";
import { PageHeader } from "@/components/page-header";
import { Card, Empty } from "@/components/ui";

export default async function ProvidersPage() {
  await requireCustomer();
  const providers = await listProviders();

  return (
    <>
      <PageHeader
        title="Service providers"
        subtitle="Find a practitioner and leave a review."
      />
      {providers.length === 0 ? (
        <Empty>No providers yet.</Empty>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left">
                <th className="px-4 py-3 font-medium text-stone-700">Name</th>
                <th className="px-4 py-3 font-medium text-stone-700">Average rating</th>
                <th className="px-4 py-3 font-medium text-stone-700">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => {
                const count = p._count.reviews;
                const avg =
                  count > 0
                    ? (p.reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
                    : null;
                return (
                  <tr key={p.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/customer/providers/${p.id}`}
                        className="text-wizard-700 hover:underline font-medium"
                      >
                        {p.displayName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {avg !== null ? `${avg} / 10` : "—"}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
