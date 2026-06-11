"use client";

import { useActionState } from "react";
import Link from "next/link";
import { customerSignupAction } from "@/lib/actions/customer-auth";
import { Button, Card, FieldError, Input, Label } from "@/components/ui";

export default function CustomerSignupPage() {
  const [state, formAction, pending] = useActionState(customerSignupAction, undefined);

  return (
    <Card>
      <h1 className="text-2xl font-bold text-wizard-900 mb-1">Create your account</h1>
      <p className="text-sm text-stone-600 mb-6">Browse practitioners and leave reviews.</p>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="displayName">Your name</Label>
          <Input id="displayName" name="displayName" type="text" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
          <p className="mt-1 text-xs text-stone-500">At least 8 characters.</p>
        </div>
        <FieldError message={state?.error} />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-stone-600 text-center">
        Already have an account?{" "}
        <Link href="/customer/login" className="text-wizard-700 hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
