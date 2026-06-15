"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth";
import { Button, Card, FieldError, Input, Label } from "@/components/ui";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!state?.success) return;
    setShowSuccess(true);
    const timer = setTimeout(() => router.push("/dashboard"), 1500);
    return () => clearTimeout(timer);
  }, [state?.success, router]);

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-xl bg-white p-8 shadow-xl flex flex-col items-center gap-4 min-w-[280px]">
            {/* Animated ring + checkmark */}
            <div className="relative flex items-center justify-center h-20 w-20">
              {/* Ping ring — runs once */}
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 animate-[ping_1s_ease-out_1]" />
              {/* Solid circle */}
              <span className="relative flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100">
                {/* Checkmark SVG */}
                <svg
                  className="h-9 w-9 text-emerald-600 animate-pulse"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900">Account created!</h2>
            <p className="text-sm text-stone-500">Taking you to your dashboard…</p>
          </div>
        </div>
      )}

      <Card>
        <h1 className="text-2xl font-bold text-wizard-900 mb-1">Open your grimoire</h1>
        <p className="text-sm text-stone-600 mb-6">Create a Potter CRM account.</p>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="displayName">Practitioner name</Label>
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
          <Button
            type="submit"
            disabled={pending || showSuccess}
            className="w-full !bg-blue-600 hover:!bg-blue-700 disabled:!bg-blue-600/60"
          >
            {pending ? "Conjuring…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-stone-600 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-wizard-700 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </>
  );
}
