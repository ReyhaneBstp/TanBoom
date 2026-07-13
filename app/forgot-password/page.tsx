import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Button } from "@/shared/components/Button";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="بازیابی رمز عبور"
      description="فعلاً بازیابی رمز عبور از طریق پشتیبانی انجام می‌شود."
    >
      <div className="space-y-4 text-center">
        <p className="text-sm leading-7 text-muted-foreground">
          برای بازیابی رمز عبور، با پشتیبانی تماس بگیرید یا دوباره ثبت‌نام نکنید تا
          حساب قبلی شما بررسی شود.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">بازگشت به ورود</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
