"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { ConfirmDialog } from "@/components/confirm-dialog";

type Props = {
  action: () => void | Promise<void>;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  triggerLabel?: string;
  triggerVariant?: "danger" | "link";
  triggerClassName?: string;
  triggerAriaLabel?: string;
};

export function ConfirmDeleteForm({
  action,
  title,
  description,
  confirmLabel = "Delete",
  triggerLabel = "Delete",
  triggerVariant = "danger",
  triggerClassName,
  triggerAriaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await action();
      setOpen(false);
    });
  }

  return (
    <>
      {triggerVariant === "link" ? (
        <button
          type="button"
          className={`text-xs text-stone-500 hover:text-red-600${triggerClassName ? ` ${triggerClassName}` : ""}`}
          aria-label={triggerAriaLabel}
          onClick={() => setOpen(true)}
        >
          {triggerLabel}
        </button>
      ) : (
        <Button
          variant="danger"
          type="button"
          className={triggerClassName}
          aria-label={triggerAriaLabel}
          onClick={() => setOpen(true)}
        >
          {triggerLabel}
        </Button>
      )}
      <ConfirmDialog
        open={open}
        onClose={() => { if (!isPending) setOpen(false); }}
        onConfirm={handleConfirm}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        pending={isPending}
      />
    </>
  );
}
