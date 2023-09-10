import { db } from "@/src/lib/db";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const googleCredentials = {
  get clientId() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || clientId.length === 0) {
      throw new Error("Missing GOOGLE_CLIENT_ID");
    }
    return clientId;
  },
  get clientSecret() {
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientSecret || clientSecret.length === 0) {
      throw new Error("Missing GOOGLE_CLIENT_SECRET");
    }
    return clientSecret;
  },
};

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: googleCredentials.clientId,
      clientSecret: googleCredentials.clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      return { ...dbUser };
    },
    async session({ session, token }) {
      if (token) {
        session.user = { ...token };
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
