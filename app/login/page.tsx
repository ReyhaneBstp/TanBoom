import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { OtpLoginForm } from "@/features/auth/components/OtpLoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl || "/");
  }

  return (
    <>
      <AuthCard
        title="ورود به تن‌بوم"
        description="برای ورود، شماره موبایل خود را وارد کنید."
      >
        <OtpLoginForm callbackUrl={params.callbackUrl} />
      </AuthCard>
    </>
  );
}
