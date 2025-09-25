import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient, Plan } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { displayName, bio, avatarUrl, tier, isAdvertised } = await req.json();
  const plan = (tier === "PREMIUM" || tier === "DIAMOND") ? tier : "FREE";

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: { displayName, bio, avatarUrl, tier: plan as Plan, isAdvertised: !!isAdvertised },
    create: { userId: user.id, displayName, bio, avatarUrl, tier: plan as Plan, isAdvertised: !!isAdvertised },
  });
  return NextResponse.json({ ok: true, profile });
}

