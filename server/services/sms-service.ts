import "server-only";

const SMS_IR_BASE_URL = process.env.SMS_IR_BASE_URL ?? "https://api.sms.ir/v1";
const SMS_IR_API_KEY = process.env.SMS_IR_API_KEY;
const SMS_IR_TEMPLATE_ID = process.env.SMS_IR_TEMPLATE_ID;

export type SmsResult =
  | { success: true }
  | { success: false; message: string };


export async function sendVerificationSms(
  mobile: string,
  code: string
): Promise<SmsResult> {
  if (!SMS_IR_API_KEY || !SMS_IR_TEMPLATE_ID) {
    return {
      success: false,
      message:
        "پیکربندی سرویس پیامک انجام نشده است. SMS_IR_API_KEY و SMS_IR_TEMPLATE_ID را در فایل .env تنظیم کنید.",
    };
  }

  const templateId = Number(SMS_IR_TEMPLATE_ID);
  const url = `${SMS_IR_BASE_URL.replace(/\/$/, "")}/send/verify`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": SMS_IR_API_KEY,
      },
      body: JSON.stringify({
        mobile,
        templateId,
        parameters: [{ name: "Code", value: code }],
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as {
      status?: number;
      message?: string;
    } | null;

    // SMS.ir status === 1 یعنی ارسال موفق
    if (!response.ok || payload?.status !== 1) {
      return {
        success: false,
        message: payload?.message ?? "ارسال پیامک با خطا مواجه شد.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: "اتصال به سرویس پیامک برقرار نشد. لطفاً دوباره تلاش کنید.",
    };
  }
}
