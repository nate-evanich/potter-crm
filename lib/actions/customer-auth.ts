"use server";

import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  displayName: z.string().min(1, "Required").max(80),
});

export type ActionResult = { error?: string } | undefined;

export async function customerSignupAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const { email, password, displayName } = parsed.data;

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  const passwordHash = await hash(password, 10);
  await prisma.customer.create({
    data: { email, passwordHash, displayName },
  });

  await signIn("customer", { email, password, redirect: false });
  redirect("/customer/providers");
}

export async function customerLoginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("customer", { email, password, redirect: false });
  } catch {
    return { error: "Invalid email or password" };
  }
  redirect("/customer/providers");
}
