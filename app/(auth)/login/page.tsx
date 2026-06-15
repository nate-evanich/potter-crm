"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button, Card, FieldError, Input, Label } from "@/components/ui";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <Card className="bg-blue-600 border-blue-700">
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-sm text-blue-100 mb-6">Log in to your grimoire.</p>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-blue-100">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" className="border-blue-400 focus:border-blue-200 focus:ring-blue-200" />
        </div>
        <div>
          <Label htmlFor="password" className="text-blue-100">Password</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" className="border-blue-400 focus:border-blue-200 focus:ring-blue-200" />
        </div>
        <FieldError message={state?.error} />
        <Button type="submit" disabled={pending} className="w-full bg-white text-blue-700 hover:bg-blue-50 disabled:bg-white/60">
          {pending ? "Casting…" : "Log in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-blue-100 text-center">
        New here?{" "}
        <Link href="/signup" className="text-white font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
