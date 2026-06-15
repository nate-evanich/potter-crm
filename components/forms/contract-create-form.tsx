"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Button, FieldError, Input, Label, Select, Textarea } from "@/components/ui";
import { createContractAction, type ContractActionState } from "@/lib/actions/contracts";
import { formatCents } from "@/lib/money";

type OfferingOption = { id: string; name: string; priceCents: number; category: string | null };
type ClientOption = { id: string; name: string };

type ItemRow = { key: number; offeringId: string; quantity: number };

export function ContractCreateForm({
  clients,
  offerings,
  defaultClientId,
}: {
  clients: ClientOption[];
  offerings: OfferingOption[];
  defaultClientId?: string;
}) {
  const [state, formAction, pending] = useActionState<ContractActionState, FormData>(
    createContractAction,
    undefined,
  );

  const [items, setItems] = useState<ItemRow[]>([
    { key: 1, offeringId: offerings[0]?.id ?? "", quantity: 1 },
  ]);
  const offeringMap = useMemo(() => new Map(offerings.map((o) => [o.id, o])), [offerings]);
  const total = items.reduce((sum, it) => {
    const price = offeringMap.get(it.offeringId)?.priceCents ?? 0;
    return sum + price * it.quantity;
  }, 0);

  function addItem() {
    setItems((prev) => [...prev, { key: Date.now(), offeringId: offerings[0]?.id ?? "", quantity: 1 }]);
    window.alert("Line item added");
  }
  function removeItem(key: number) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((it) => it.key !== key)));
  }
  function patch(key: number, patchVal: Partial<ItemRow>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patchVal } : it)));
  }

  if (clients.length === 0) {
    return (
      <p className="text-sm text-stone-600">
        You need to{" "}
        <Link href="/clients/new" className="text-wizard-700 hover:underline">
          add a client
        </Link>{" "}
        first.
      </p>
    );
  }
  if (offerings.length === 0) {
    return (
      <p className="text-sm text-stone-600">
        You need to{" "}
        <Link href="/offerings/new" className="text-wizard-700 hover:underline">
          add an offering
        </Link>{" "}
        first.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select id="clientId" name="clientId" defaultValue={defaultClientId ?? clients[0].id} required>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue="DRAFT">
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="e.g. Curse Vance's ex-husband" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" />
        </div>
        <div>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-800">Offerings</h2>
          <button type="button" onClick={addItem} className="text-sm text-wizard-700 hover:underline">
            + Add offering
          </button>
        </div>
        <div className="space-y-2">
          {items.map((it) => {
            const offering = offeringMap.get(it.offeringId);
            return (
              <div key={it.key} className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-3">
                <Select
                  name="itemOfferingId"
                  value={it.offeringId}
                  onChange={(e) => patch(it.key, { offeringId: e.target.value })}
                  className="flex-1"
                >
                  {offerings.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.category ? `[${o.category}] ` : ""}
                      {o.name} — {formatCents(o.priceCents)}
                    </option>
                  ))}
                </Select>
                <Input
                  name="itemQuantity"
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => patch(it.key, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                  className="w-20"
                />
                <span className="w-24 text-right text-sm tabular-nums">
                  {formatCents((offering?.priceCents ?? 0) * it.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(it.key)}
                  className="text-sm text-stone-500 hover:text-red-600"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end text-sm font-medium text-stone-800">
          Total: <span className="ml-2 tabular-nums">{formatCents(total)}</span>
        </div>
      </div>

      <FieldError message={state?.error} />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Create contract"}
        </Button>
        <Link href="/contracts" className="text-sm text-stone-600 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
