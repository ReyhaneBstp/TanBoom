import type { NextAuthConfig } from "next-auth";

/**
 * پیکربندی سبک و سازگار با Edge Runtime.
 * این فایل نباید ماژول‌های مخصوص Node (مثل crypto) یا provider با authorize را وارد کند،
 * چون توسط middleware در Edge اجرا می‌شود.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email ?? "";
        token.mobile = (user as { mobile?: string }).mobile ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? "";
        session.user.email = token.email as string;
        session.user.mobile = (token.mobile as string) ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
