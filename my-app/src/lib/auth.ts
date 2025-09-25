import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions satisfies NextAuthOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function getOptionalSession() {
  const session = await getServerSession(authOptions satisfies NextAuthOptions);
  return session;
}

