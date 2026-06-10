import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getContract } from "@/lib/db/contracts";
import { Badge, Button, Card, Empty } from "@/components/ui";
import { formatCents } from "@/lib/money";
import { contractTotal, paidTotal, statusTone } from "@/lib/contract-math";
import { PaymentForm } from "@/components/forms/payment-form";
import { DeletePaymentButton } from "@/components/forms/delete-payment-button";
import { DeleteContractButton } from "@/components/forms/delete-contract-button";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const contract = await getContract(user.id, id);
  if (!contract) notFound();

  const total = contractTotal(contract.items);
  const paid = paidTotal(contract.payments);
  const balance = total - paid;

  return (
    <>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{contract.title}</h1>
          <p className="text-sm text-stone-600 mt-1">
            For{" "}
            <Link href={`/clients/${contract.client.id}`} className="text-wizard-700 hover:underline">
              {contract.client.name}
            </Link>{" "}
            · <Badge tone={statusTone(contract.status)}>{contract.status}</Badge>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-xs text-stone-500">Total</p>
          <p className="text-xl font-semibold mt-1">{formatCents(total)}</p>
        </Card>
        <Card>
          <p className="text-xs text-stone-500">Paid</p>
          <p className="text-xl font-semibold mt-1 text-emerald-700">{formatCents(paid)}</p>
        </Card>
        <Card>
          <p className="text-xs text-stone-500">Balance</p>
          <p className={`text-xl font-semibold mt-1 ${balance > 0 ? "text-red-700" : "text-stone-700"}`}>
            {formatCents(balance)}
          </p>
        </Card>
      </div>

      <h2 className="text-lg font-semibold text-stone-900 mb-3">Line items</h2>
      <Card className="p-0 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Offering</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {contract.items.map((it) => (
              <tr key={it.id}>
                <td className="px-4 py-3">
                  <Link href={`/offerings/${it.offering.id}`} className="text-wizard-700 hover:underline">
                    {it.offering.name}
                  </Link>
                  {it.offering.category ? <span className="ml-2 text-xs text-stone-500">[{it.offering.category}]</span> : null}
                </td>
                <td className="px-4 py-3">{it.quantity}</td>
                <td className="px-4 py-3">{formatCents(it.priceCents)}</td>
                <td className="px-4 py-3 font-medium">{formatCents(it.priceCents * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <h2 className="text-lg font-semibold text-stone-900 mb-3">Payments</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {contract.payments.length === 0 ? (
            <Empty>No payments recorded yet.</Empty>
          ) : (
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {contract.payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3">{p.paidAt.toISOString().slice(0, 10)}</td>
                      <td className="px-4 py-3 font-medium">{formatCents(p.amountCents)}</td>
                      <td className="px-4 py-3 text-stone-600">{p.method ?? "—"}</td>
                      <td className="px-4 py-3 text-stone-600">{p.notes ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <DeletePaymentButton paymentId={p.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
        <Card>
          <h3 className="text-sm font-semibold text-stone-800 mb-3">Record a payment</h3>
          <PaymentForm contractId={contract.id} suggestedAmountCents={Math.max(balance, 0)} />
        </Card>
      </div>

      {contract.notes ? (
        <Card className="mb-8">
          <h2 className="text-sm font-semibold text-stone-500 mb-2">Notes</h2>
          <p className="text-sm whitespace-pre-wrap text-stone-700">{contract.notes}</p>
        </Card>
      ) : null}

      <div className="flex items-center gap-3">
        <Link
          href={`/contracts/${contract.id}/edit`}
          className="inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-100"
        >
          Edit
        </Link>
        <DeleteContractButton contractId={contract.id} />
      </div>
    </>
  );
}
