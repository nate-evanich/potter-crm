import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    // Practitioner login
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
        };
      },
    }),
    // Customer login
    Credentials({
      id: "customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const customer = await prisma.customer.findUnique({ where: { email } });
        if (!customer) return null;

        const ok = await compare(password, customer.passwordHash);
        if (!ok) return null;

        return {
          id: `customer:${customer.id}`,
          email: customer.email,
          name: customer.displayName,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id as string;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token?.userId && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return { id: session.user.id, email: session.user.email!, name: session.user.name ?? "" };
}

export async function requireCustomer() {
  const session = await auth();
  const rawId = session?.user?.id;
  if (!rawId?.startsWith("customer:")) {
    redirect("/customer/login");
  }
  const id = rawId.slice("customer:".length);
  return { id, email: session!.user!.email!, name: session!.user!.name ?? "" };
}
