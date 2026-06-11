import Link from "next/link";
import { requireCustomer } from "@/lib/auth";
import { customerLogoutAction } from "@/lib/actions/session";

export default async function CustomerProvidersLayout({ children }: { children: React.ReactNode }) {
  const customer = await requireCustomer();

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/customer/providers" className="text-xl font-bold text-wizard-900">
            Potter CRM
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-600">{customer.name || customer.email}</span>
            <form action={customerLogoutAction}>
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
