"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { MdOutlineSms } from "react-icons/md";
import { mobileSchema, otpSchema } from "@/features/auth/lib/validations";
import { sendOtpAction, verifyOtpAction } from "@/server/actions/auth-actions";
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
        className="flex flex-1 flex-col justify-between gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendOtp();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="mobile" className="mx-1">شماره موبایل</Label>
          <Input
            id="mobile"
            name="mobile"
            type="number"
            dir="ltr"
            inputMode="numeric"
            maxLength={11}
            placeholder="09123456789"
            className="text-left placeholder:text-right my-2"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))}
            autoFocus
          />
        </div>

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        <div className="mt-auto">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "در حال ارسال کد..." : "دریافت کد تأیید"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      className="flex flex-1 flex-col justify-between gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleVerifyOtp();
      }}
    >

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleEditMobile}
          className="group flex items-center gap-1 text-sm text-primary-600 transition-colors hover:text-primary-700"
        >
          <HiOutlineArrowRight className="size-4 transition-transform group-hover:-translate-x-0.5" />
          ویرایش شماره
        </button>
        <div
          className="rounded-full bg-primary-50/60 px-3 py-1 text-sm font-medium text-primary-700"
          dir="ltr"
        >
          {mobile}
        </div>
      </div>


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
          className="text-center text-xl tracking-[0.5em] font-mono my-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          autoFocus
        />
      </div>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <div className="mt-auto space-y-3">
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "در حال بررسی..." : "ورود"}
        </Button>
        <div className="text-center text-sm">
          {secondsLeft > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50/60 px-3 py-1 text-xs font-medium text-primary-700">
              <span className="inline-block w-5 text-center font-mono">{secondsLeft}</span>
              ثانیه تا ارسال مجدد
            </span>
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
      </div>
    </form>
  );
}