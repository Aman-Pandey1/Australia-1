import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient, Plan } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.redirect(new URL("/login?callbackUrl=/subscription", req.url));
  const formData = await req.formData();
  const planParam = String(formData.get("plan") || "FREE");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.redirect(new URL("/login?callbackUrl=/subscription", req.url));

  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const plan: Plan = planParam === "DIAMOND" ? "DIAMOND" : planParam === "PREMIUM" ? "PREMIUM" : "FREE";

  if (plan === "FREE") {
    await prisma.profile.update({ where: { userId: user.id }, data: { tier: "FREE" } });
    return NextResponse.redirect(new URL("/subscription", req.url));
  }

  await prisma.subscription.create({ data: { userId: user.id, plan, expiresAt: expires } });
  await prisma.profile.update({ where: { userId: user.id }, data: { tier: plan } });
  return NextResponse.redirect(new URL("/subscription", req.url));
}

