"use client";

import { useActionState } from "react";
import { Button, FieldError, Label, Textarea } from "@/components/ui";
import { submitReviewAction, type ActionResult } from "@/lib/actions/reviews";

type ReviewValues = {
  rating: number;
  comment: string | null;
};

export function ReviewForm({
  providerId,
  initial,
}: {
  providerId: string;
  initial?: ReviewValues | null;
}) {
  const action = submitReviewAction.bind(null, providerId);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="rating">Rating</Label>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => (
            <label key={value} className="flex items-center gap-1 text-sm text-stone-700">
              <input
                type="radio"
                name="rating"
                value={value}
                defaultChecked={initial?.rating === value}
                className="accent-wizard-600"
              />
              {value} / 20
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          name="comment"
          rows={4}
          maxLength={2000}
          placeholder="Share your experience…"
          defaultValue={initial?.comment ?? ""}
        />
      </div>
      <FieldError message={state?.error} />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : initial ? "Update review" : "Submit review"}
      </Button>
    </form>
  );
}
