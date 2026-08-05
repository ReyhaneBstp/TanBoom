import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { verifyOtpSchema } from "@/features/auth/lib/validations";
import { verifyOtpAndResolveUser } from "@/server/services/auth-service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "otp",
      credentials: {
        mobile: { label: "Mobile", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const parsed = verifyOtpSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await verifyOtpAndResolveUser(parsed.data);

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],
});
