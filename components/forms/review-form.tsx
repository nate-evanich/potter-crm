"use client";

import { useActionState, useEffect, useState } from "react";
import { Button, FieldError, Textarea, Label } from "@/components/ui";
import { submitReviewAction, type ReviewActionState } from "@/lib/actions/reviews";

export function ReviewForm({
  providerId,
  initial,
}: {
  providerId: string;
  initial: { rating: number; comment: string | null } | null;
}) {
  const action = submitReviewAction.bind(null, providerId);
  const [state, formAction, pending] = useActionState<ReviewActionState, FormData>(
    action,
    undefined,
  );

  const [rating, setRating] = useState<number>(initial?.rating ?? 0);
  const [comment, setComment] = useState<string>(initial?.comment ?? "");
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  // When a submission succeeds (state goes back to undefined), reset to edit step.
  const [prevState, setPrevState] = useState<ReviewActionState>(undefined);
  useEffect(() => {
    if (prevState !== undefined && state === undefined && !pending) {
      setStep("edit");
    }
    setPrevState(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, pending]);

  function handleReviewClick() {
    if (rating < 1 || rating > 10) {
      setLocalError("Choose a rating from 1 to 10");
      return;
    }
    setLocalError(undefined);
    setStep("confirm");
  }

  return (
    <form action={formAction} className="space-y-4">
      {step === "edit" ? (
        <>
          <div>
            <Label>Rating</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant={rating === n ? "primary" : "secondary"}
                  aria-label={`Rate ${n} out of 10`}
                  aria-pressed={rating === n}
                  onClick={() => {
                    setRating(n);
                    setLocalError(undefined);
                  }}
                  className="w-10 px-0"
                >
                  {n}
                </Button>
              ))}
            </div>
            <FieldError message={localError} />
          </div>
          <input type="hidden" name="rating" value={rating} />
          <div>
            <Label htmlFor="comment">Comment <span className="text-stone-400 font-normal">(optional)</span></Label>
            <Textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Share your experience…"
            />
          </div>
          <FieldError message={state?.error} />
          <Button type="button" onClick={handleReviewClick}>
            Review your submission
          </Button>
        </>
      ) : (
        <>
          <div className="rounded-md border border-stone-200 bg-stone-50 p-4 space-y-2">
            <p className="text-sm font-medium text-stone-700">You&apos;re submitting:</p>
            <p className="text-sm text-stone-800">
              <span className="font-medium">Rating:</span> {rating} / 10
            </p>
            <p className="text-sm text-stone-800">
              <span className="font-medium">Comment:</span>{" "}
              {comment.trim() ? (
                comment
              ) : (
                <span className="text-stone-400">(no comment)</span>
              )}
            </p>
          </div>
          {/* Hidden inputs so the form posts the confirmed values */}
          <input type="hidden" name="rating" value={rating} />
          <input type="hidden" name="comment" value={comment} />
          <FieldError message={state?.error} />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("edit")}
            >
              Edit
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting…" : "Confirm and submit"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
