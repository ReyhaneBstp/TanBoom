import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/design");
  }

  const params = await searchParams;

  return (
    <AuthCard
      title="ورود به تن‌بوم"
      description="برای ادامه طراحی، وارد حساب کاربری خود شوید."
    >
      <LoginForm callbackUrl={params.callbackUrl} />
    </AuthCard>
  );
}
