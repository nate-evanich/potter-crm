"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui";

type ClientOption = { id: string; name: string };

export function ClientFilter({
  clients,
  selectedClientId,
}: {
  clients: ClientOption[];
  selectedClientId: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value) {
      router.push(`/contracts?clientId=${value}`);
    } else {
      router.push("/contracts");
    }
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <label htmlFor="client-filter" className="text-sm font-medium text-stone-700 whitespace-nowrap">
        Client
      </label>
      <Select
        id="client-filter"
        value={selectedClientId}
        onChange={handleChange}
        className="max-w-xs"
      >
        <option value="">All clients</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
