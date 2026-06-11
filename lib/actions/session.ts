"use server";

import { signOut } from "@/lib/auth";

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function customerLogoutAction() {
  await signOut({ redirectTo: "/customer/login" });
}
