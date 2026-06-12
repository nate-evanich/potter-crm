"use client";

import { useState } from "react";
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

  const [stage, setStage] = useState<"edit" | "confirm">("edit");
  const [pendingRating, setPendingRating] = useState<number | null>(initial?.rating ?? null);
  const [pendingComment, setPendingComment] = useState<string>(initial?.comment ?? "");
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  function handleReview() {
    const form = document.querySelector<HTMLFormElement>("#review-edit-form");
    const ratingInput = form?.querySelector<HTMLInputElement>("input[name='rating']:checked");
    const commentInput = form?.querySelector<HTMLTextAreaElement>("textarea[name='comment']");

    if (!ratingInput) {
      setLocalError("Choose a rating");
      return;
    }

    setLocalError(undefined);
    setPendingRating(Number(ratingInput.value));
    setPendingComment(commentInput?.value ?? "");
    setStage("confirm");
  }

  if (stage === "confirm") {
    return (
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="rating" value={pendingRating ?? ""} />
        <input type="hidden" name="comment" value={pendingComment} />

        <div className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700 space-y-1">
          <p>
            <span className="font-medium">You&apos;re about to submit:</span>{" "}
            <span className="text-amber-600 font-semibold">
              {pendingRating} / 10
            </span>
          </p>
          {pendingComment ? (
            <p className="whitespace-pre-wrap">{pendingComment}</p>
          ) : (
            <p className="text-stone-400 italic">(no comment)</p>
          )}
        </div>

        <FieldError message={state?.error} />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStage("edit")}
            disabled={pending}
          >
            Edit
          </Button>
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : initial
              ? "Confirm and update"
              : "Confirm and submit"}
          </Button>
        </div>
      </form>
    );
  }

  // "edit" stage
  return (
    <form id="review-edit-form" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <label key={value} className="flex items-center gap-1 text-sm text-stone-700">
              <input
                type="radio"
                name="rating"
                value={value}
                defaultChecked={pendingRating === value}
                className="accent-wizard-600"
              />
              {value} / 10
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
          defaultValue={pendingComment}
        />
      </div>
      <FieldError message={localError ?? state?.error} />
      <Button type="button" onClick={handleReview}>
        Review submission
      </Button>
    </form>
  );
}
