"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRight } from "react-icons/hi2";
import {
  mobileSchema,
  otpSchema,
} from "@/features/auth/lib/validations";
import {
  sendOtpAction,
  verifyOtpAction,
} from "@/server/actions/auth-actions";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Label } from "@/shared/components/Label";

const RESEND_SECONDS = 120;

type Step = "mobile" | "otp";

export function OtpLoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startCountdown(seconds: number) {
    setSecondsLeft(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }

  async function handleSendOtp() {
    setError(null);

    const parsed = mobileSchema.safeParse(mobile);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "شماره موبایل نامعتبر است.");
      return;
    }

    setPending(true);
    const result = await sendOtpAction(parsed.data);
    setPending(false);

    if (!result.success) {
      setError(result.message ?? "ارسال کد با خطا مواجه شد.");
      if (result.retryAfterMs) {
        setStep("otp");
        startCountdown(Math.ceil(result.retryAfterMs / 1000));
      }
      return;
    }

    setStep("otp");
    setOtp("");
    startCountdown(RESEND_SECONDS);
  }

  async function handleVerifyOtp() {
    setError(null);

    const parsed = otpSchema.safeParse(otp);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "کد تأیید نامعتبر است.");
      return;
    }

    setPending(true);
    const result = await verifyOtpAction(mobile, parsed.data);

    if (!result.success) {
      setPending(false);
      setError(result.message ?? "تأیید کد با خطا مواجه شد.");
      return;
    }

    router.push(callbackUrl || "/");
    router.refresh();
  }

  function handleEditMobile() {
    setStep("mobile");
    setError(null);
    setOtp("");
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(0);
  }

  if (step === "mobile") {
    return (
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendOtp();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="mobile">شماره موبایل</Label>
          <Input
            id="mobile"
            name="mobile"
            type="number"
            dir="ltr"
            inputMode="numeric"
            maxLength={11}
            placeholder="09123456789"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))
            }
            autoFocus
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "در حال ارسال کد..." : "دریافت کد تأیید"}
        </Button>
      </form>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleVerifyOtp();
      }}
    >
      <button
        type="button"
        onClick={handleEditMobile}
        className="flex items-center gap-1 text-sm text-primary-600 transition-colors hover:text-primary-700"
      >
        <HiOutlineArrowRight className="size-4" />
        ویرایش شماره
      </button>

      <p className="text-sm text-muted-foreground">
        کد تأیید به شماره <span dir="ltr">{mobile}</span> ارسال شد.
      </p>

      <div className="space-y-2">
        <Label htmlFor="otp">کد تأیید</Label>
        <Input
          id="otp"
          name="otp"
          type="number"
          dir="ltr"
          inputMode="numeric"
          maxLength={6}
          placeholder="------"
          className="text-center tracking-[0.5em]"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          autoFocus
        />
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "در حال بررسی..." : "ورود"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {secondsLeft > 0 ? (
          <span>ارسال مجدد کد تا {secondsLeft} ثانیه دیگر</span>
        ) : (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={pending}
            className="font-semibold text-primary-600 transition-colors hover:text-primary-700 disabled:opacity-50"
          >
            ارسال مجدد کد
          </button>
        )}
      </div>
    </form>
  );
}
