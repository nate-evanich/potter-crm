import Link from "next/link";

const steps = [
  {
    title: "Find your practitioner",
    body: "Browse the witches and wizards you've worked with and see how others have rated them.",
  },
  {
    title: "Share your experience",
    body: "Leave a review on a 1–10 scale to help other seekers choose the right magical service.",
  },
  {
    title: "Keep it in one place",
    body: "Your account remembers every provider and review, ready whenever you return.",
  },
];

export default function CustomerWelcomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-10 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-wizard-900 sm:text-5xl">
            Welcome to the Potter CRM customer portal
          </h1>
          <p className="text-lg text-stone-700">
            Discover trusted practitioners and share honest reviews of the magical services you've
            received.
          </p>
        </div>

        <div className="grid gap-4 text-left sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
            >
              <h2 className="mb-1 text-base font-semibold text-wizard-900">{step.title}</h2>
              <p className="text-sm text-stone-600">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/customer/signup"
            className="w-full rounded-md bg-wizard-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-wizard-700 sm:w-auto"
          >
            Create an account
          </Link>
          <Link
            href="/customer/login"
            className="w-full rounded-md border border-wizard-600 px-6 py-2.5 text-sm font-medium text-wizard-700 transition hover:bg-wizard-50 sm:w-auto"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
