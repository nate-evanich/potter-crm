import { requireCustomer } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/session";

export default async function CustomerShellLayout({ children }: { children: React.ReactNode }) {
  const customer = await requireCustomer();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white px-6 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-wizard-900">Potter CRM — Customer</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-600">{customer.name || customer.email}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-stone-700 hover:underline"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-8 max-w-5xl w-full mx-auto">{children}</main>
    </div>
  );
}
