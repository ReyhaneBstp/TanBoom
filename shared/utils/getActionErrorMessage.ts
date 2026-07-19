
export function getActionErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "اتصال اینترنت برقرار نیست. اتصال خود را بررسی کنید و دوباره تلاش کنید.";
  }

  const message = error instanceof Error ? error.message : "";

  if (/وارد شوید/.test(message)) {
    return "نشست شما منقضی شده است. لطفاً دوباره وارد حساب کاربری خود شوید.";
  }
  if (/یافت نشد|دسترسی/.test(message)) {
    return "این مورد پیدا نشد یا به آن دسترسی ندارید. صفحه را نوسازی کنید و دوباره تلاش کنید.";
  }
  if (/Failed to fetch|NetworkError|fetch failed/i.test(message)) {
    return "ارتباط با سرور برقرار نشد. چند لحظه بعد دوباره تلاش کنید.";
  }

  if (message && /[؀-ۿ]/.test(message)) {
    return message;
  }

  return fallback;
}
