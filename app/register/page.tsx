import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <AuthCard
      title="ساخت حساب کاربری"
      description="با همان ظاهر فعلی، فقط چند قدم تا شروع طراحی فاصله دارید."
    >
      <RegisterForm />
    </AuthCard>
  );
}
