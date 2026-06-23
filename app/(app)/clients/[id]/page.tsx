import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getClient } from "@/lib/db/clients";
import { deleteClientAction } from "@/lib/actions/clients";
import { PageHeader } from "@/components/page-header";
import { Badge, Card, Empty } from "@/components/ui";
import { ConfirmDeleteForm } from "@/components/forms/confirm-delete-form";
import { formatCents } from "@/lib/money";
import { contractTotal, paidTotal, statusTone } from "@/lib/contract-math";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const client = await getClient(user.id, id);
  if (!client) notFound();

  const remove = deleteClientAction.bind(null, client.id);

  return (
    <>
      <PageHeader title={client.name} subtitle={client.email ?? undefined} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h2 className="text-sm font-semibold text-stone-500 mb-3">Contact</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-stone-500">Email</dt>
              <dd>{client.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Phone</dt>
              <dd>{client.phone ?? "—"}</dd>
            </div>
          </dl>
        </Card>
        <Card className="md:col-span-2">
          <h2 className="text-sm font-semibold text-stone-500 mb-3">Notes</h2>
          <p className="text-sm whitespace-pre-wrap text-stone-700">{client.notes ?? "No notes yet."}</p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-stone-900">Contracts</h2>
        <Link
          href={`/contracts/new?clientId=${client.id}`}
          className="text-sm text-wizard-700 hover:underline"
        >
          + New contract
        </Link>
      </div>

      {client.contracts.length === 0 ? (
        <Empty>No contracts yet.</Empty>
      ) : (
        <Card className="p-0 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {client.contracts.map((c) => {
                const total = contractTotal(c.items);
                const paid = paidTotal(c.payments);
                return (
                  <tr key={c.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/contracts/${c.id}`} className="text-wizard-700 hover:underline">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                    <td className="px-4 py-3">{formatCents(total)}</td>
                    <td className="px-4 py-3">{formatCents(paid)}</td>
                    <td className="px-4 py-3 font-medium">{formatCents(total - paid)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Link
          href={`/clients/${client.id}/edit`}
          className="inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-100"
        >
          Edit client
        </Link>
        <form action={remove}>
          <Button variant="danger" type="submit">Delete</Button>
        </form>
      </div>
    </>
  );
}
