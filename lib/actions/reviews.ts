"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth";
import { upsertReview } from "@/lib/db/reviews";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating from 1 to 10").max(10, "Choose a rating from 1 to 10"),
  comment: z.string().max(2000).optional().default(""),
});

export type ReviewActionState = { error?: string } | undefined;

export async function submitReviewAction(
  providerId: string,
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const customer = await requireCustomer();

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  await upsertReview(customer.id, providerId, {
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });

  revalidatePath(`/customer/providers/${providerId}`);
}
