import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listContracts } from "@/lib/db/contracts";
import { listClientsForSelect } from "@/lib/db/clients";
import { PageHeader } from "@/components/page-header";
import { Badge, Card, Empty } from "@/components/ui";
import { formatCents } from "@/lib/money";
import { contractTotal, paidTotal, statusTone } from "@/lib/contract-math";
import { ClientFilter } from "./_components/client-filter";

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  const user = await requireUser();
  const [contracts, clients] = await Promise.all([
    listContracts(user.id, clientId || undefined),
    listClientsForSelect(user.id),
  ]);

  const activeClientId = clientId ?? "";

  return (
    <>
      <PageHeader
        title="Contracts"
        subtitle="Magical agreements with your clients."
        action={{ href: "/contracts/new", label: "New contract" }}
      />
      {clients.length > 0 && (
        <ClientFilter clients={clients} selectedClientId={activeClientId} />
      )}
      {contracts.length === 0 ? (
        activeClientId ? (
          <Empty>
            No contracts for this client.{" "}
            <Link href="/contracts" className="text-wizard-700 hover:underline">
              Clear filter
            </Link>
            .
          </Empty>
        ) : (
          <Empty>
            No contracts yet.{" "}
            <Link href="/contracts/new" className="text-wizard-700 hover:underline">
              Draft your first one
            </Link>
            .
          </Empty>
        )
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {contracts.map((c) => {
                const total = contractTotal(c.items);
                const paid = paidTotal(c.payments);
                return (
                  <tr key={c.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/contracts/${c.id}`} className="text-wizard-700 hover:underline">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/clients/${c.client.id}`} className="text-stone-700 hover:underline">
                        {c.client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                    </td>
                    <td className="px-4 py-3">{formatCents(total)}</td>
                    <td className="px-4 py-3 font-medium">{formatCents(total - paid)}</td>
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
