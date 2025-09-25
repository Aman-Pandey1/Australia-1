import NextAuth, { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return minimal user shape; role will be loaded in jwt callback
        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub }, select: { role: true } });
        if (dbUser) {
          // attach role to JWT (typed via module augmentation)
          (token as JWT).role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // propagate role from JWT to session
      // types augmented in src/types/next-auth.d.ts
      if (session.user) {
        session.user.role = (token as JWT).role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

