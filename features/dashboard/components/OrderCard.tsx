"use client";

import { motion } from "motion/react";
import {
  HiOutlineCalendarDays,
  HiOutlineCube,
  HiOutlineSwatch,
} from "react-icons/hi2";
import type { OrderRecord } from "@/server/services/order-service";
import { ease } from "@/shared/definitions/motion";
import {
  formatPersianDate,
  getOrderStatusConfig,
  ORDER_FLOW_STEPS,
  orderStatusConfig,
} from "../definitions/order-status";

interface OrderCardProps {
  order: OrderRecord;
  index: number;
}

export function OrderCard({ order, index }: OrderCardProps) {
  const status = getOrderStatusConfig(order.status);
  const StatusIcon = status.icon;
  const isCancelled = order.status === "cancelled";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: Math.min(index * 0.06, 0.4) }}
      className="rounded-[2rem] border border-white/80 bg-white/55 p-4 shadow-soft-rose backdrop-blur-xl sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {order.designImage ? (
          <img
            src={order.designImage}
            alt={order.designTitle ?? "طرح سفارش"}
            className="size-20 shrink-0 rounded-[1.3rem] border border-white/80 object-cover"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-[1.3rem] bg-primary-100/70">
            <HiOutlineSwatch className="size-8 text-primary-400" />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {order.designTitle ?? "طرح حذف شده"}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${status.badgeClass}`}
            >
              <StatusIcon className="size-3.5" />
              {status.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HiOutlineCube className="size-3.5" />
              سایز {order.size} · {order.quantity} عدد
            </span>
            <span className="inline-flex items-center gap-1">
              <HiOutlineCalendarDays className="size-3.5" />
              {formatPersianDate(order.createdAt)}
            </span>
          </div>

          {order.notes && (
            <p className="line-clamp-1 text-xs text-muted-foreground/80">
              توضیحات: {order.notes}
            </p>
          )}
        </div>
      </div>

      {isCancelled ? (
        <p className="mt-4 rounded-[1.3rem] border border-red-100 bg-red-50/70 px-4 py-2.5 text-xs text-red-700">
          این سفارش لغو شده است. برای ثبت سفارش جدید از طرح‌های خود اقدام کنید.
        </p>
      ) : (
        <div className="mt-5 px-1">
          <div className="flex items-center">
            {ORDER_FLOW_STEPS.map((step, i) => {
              const cfg = orderStatusConfig[step];
              const reached = status.step >= i;
              const isCurrent = status.step === i;
              return (
                <div
                  key={step}
                  className={`flex items-center ${i > 0 ? "flex-1" : ""}`}
                >
                  {i > 0 && (
                    <div
                      className={`h-0.5 flex-1 rounded-full transition-colors ${
                        reached ? "bg-accent" : "bg-primary-200/60"
                      }`}
                    />
                  )}
                  <div className="flex flex-col items-center gap-1.5 px-1">
                    <span
                      className={`flex size-6 items-center justify-center rounded-full border-2 transition-all ${
                        reached
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-primary-200/80 bg-white/70 text-muted-foreground/60"
                      } ${isCurrent ? "ring-4 ring-accent/20" : ""}`}
                    >
                      <cfg.icon className="size-3.5" />
                    </span>
                    <span
                      className={`whitespace-nowrap text-[10px] font-medium ${
                        reached ? "text-foreground" : "text-muted-foreground/60"
                      }`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.article>
  );
}
