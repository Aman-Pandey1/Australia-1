import { PrismaClient, Plan } from "@prisma/client";
import ProfileCard from "@/components/ProfileCard";

const prisma = new PrismaClient();

async function getProfiles() {
  const [diamond, premium, free] = await Promise.all([
    prisma.profile.findMany({
      where: { tier: Plan.DIAMOND },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
    }),
    prisma.profile.findMany({
      where: { tier: Plan.PREMIUM },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
    }),
    prisma.profile.findMany({
      where: { tier: Plan.FREE, isAdvertised: true },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: 24,
    }),
  ]);
  return { diamond, premium, free };
}

export default async function Home() {
  const { diamond, premium, free } = await getProfiles();
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold mb-4">Diamond</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diamond.map(p => (
            <ProfileCard key={p.id} displayName={p.displayName} bio={p.bio} avatarUrl={p.avatarUrl || undefined} plan="DIAMOND" />
          ))}
          {diamond.length === 0 && <p className="opacity-70">No diamond profiles yet.</p>}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Premium</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {premium.map(p => (
            <ProfileCard key={p.id} displayName={p.displayName} bio={p.bio} avatarUrl={p.avatarUrl || undefined} plan="PREMIUM" />
          ))}
          {premium.length === 0 && <p className="opacity-70">No premium profiles yet.</p>}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Free (Advertised)</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {free.map(p => (
            <ProfileCard key={p.id} displayName={p.displayName} bio={p.bio} avatarUrl={p.avatarUrl || undefined} plan="FREE" />
          ))}
          {free.length === 0 && <p className="opacity-70">No advertised free profiles yet.</p>}
        </div>
      </section>
    </div>
  );
}
