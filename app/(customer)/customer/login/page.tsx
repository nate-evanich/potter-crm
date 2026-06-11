"use client";

import { useActionState } from "react";
import Link from "next/link";
import { customerLoginAction } from "@/lib/actions/customer-auth";
import { Button, Card, FieldError, Input, Label } from "@/components/ui";

export default function CustomerLoginPage() {
  const [state, formAction, pending] = useActionState(customerLoginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-2xl font-bold text-wizard-900 mb-1">Welcome back</h1>
          <p className="text-sm text-stone-600 mb-6">Log in to review your service providers.</p>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <FieldError message={state?.error} />
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Casting…" : "Log in"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-stone-600 text-center">
            New here?{" "}
            <Link href="/customer/signup" className="text-wizard-700 hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
