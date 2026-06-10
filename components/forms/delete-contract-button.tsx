"use client";

import { deleteContractAction } from "@/lib/actions/contracts";
import { Button } from "@/components/ui";

export function DeleteContractButton({ contractId }: { contractId: string }) {
  const action = deleteContractAction.bind(null, contractId);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm("Are you sure you want to delete this contract? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <Button variant="danger" type="submit">Delete contract</Button>
    </form>
  );
}
