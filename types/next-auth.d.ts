import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: "practitioner" | "customer";
    };
  }

  interface User {
    role?: "practitioner" | "customer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: "practitioner" | "customer";
  }
}
