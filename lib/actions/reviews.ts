"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertReview } from "@/lib/db/reviews";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating").max(10, "Choose a rating"),
  comment: z.string().max(2000).optional(),
});

export type ActionResult = { error?: string } | undefined;

export async function submitReviewAction(
  providerId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const customer = await requireCustomer();

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const provider = await prisma.user.findUnique({ where: { id: providerId }, select: { id: true } });
  if (!provider) {
    return { error: "Service provider not found" };
  }

  const comment = parsed.data.comment?.trim();
  await upsertReview(customer.id, providerId, {
    rating: parsed.data.rating,
    comment: comment ? comment : null,
  });

  revalidatePath(`/customer/providers/${providerId}`);
  revalidatePath("/customer/providers");
  return undefined;
}
