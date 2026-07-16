import type { IconType } from "react-icons";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineHome,
  HiOutlineXCircle,
} from "react-icons/hi2";

export type OrderStatusConfig = {
  label: string;
  icon: IconType;
  /** index in the fulfilment flow (pending → delivered); -1 = out of flow */
  step: number;
  badgeClass: string;
  dotClass: string;
};

export const ORDER_FLOW_STEPS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
] as const;

export const orderStatusConfig: Record<string, OrderStatusConfig> = {
  pending: {
    label: "در انتظار بررسی",
    icon: HiOutlineClock,
    step: 0,
    badgeClass: "bg-amber-100/80 text-amber-800 border-amber-200",
    dotClass: "bg-amber-400",
  },
  confirmed: {
    label: "تأیید شده",
    icon: HiOutlineCheckCircle,
    step: 1,
    badgeClass: "bg-sky-100/80 text-sky-800 border-sky-200",
    dotClass: "bg-sky-400",
  },
  shipped: {
    label: "ارسال شده",
    icon: HiOutlineTruck,
    step: 2,
    badgeClass: "bg-violet-100/80 text-violet-800 border-violet-200",
    dotClass: "bg-violet-400",
  },
  delivered: {
    label: "تحویل داده شده",
    icon: HiOutlineHome,
    step: 3,
    badgeClass: "bg-emerald-100/80 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-400",
  },
  cancelled: {
    label: "لغو شده",
    icon: HiOutlineXCircle,
    step: -1,
    badgeClass: "bg-red-100/80 text-red-700 border-red-200",
    dotClass: "bg-red-400",
  },
};

export const fallbackStatusConfig: OrderStatusConfig = {
  label: "نامشخص",
  icon: HiOutlineClock,
  step: -1,
  badgeClass: "bg-muted text-muted-foreground border-border",
  dotClass: "bg-muted-foreground",
};

export function getOrderStatusConfig(status: string): OrderStatusConfig {
  return orderStatusConfig[status] ?? fallbackStatusConfig;
}

export function formatPersianDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
