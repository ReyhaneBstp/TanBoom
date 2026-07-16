"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  HiOutlineGlobeAlt,
  HiOutlinePaintBrush,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import type { DesignRecord } from "@/server/services/design-service";
import type { OrderRecord } from "@/server/services/order-service";
import { ease } from "@/shared/definitions/motion";
import { DesignCard } from "./components/DesignCard";
import { OrderCard } from "./components/OrderCard";
import { EmptyState } from "./components/EmptyState";

type TabKey = "orders" | "designs" | "public";

interface DashboardViewProps {
  userName: string | null;
  designs: DesignRecord[];
  orders: OrderRecord[];
}

export function DashboardView({
  userName,
  designs,
  orders,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("orders");

  const publicDesigns = useMemo(
    () => designs.filter((d) => d.isPublic),
    [designs]
  );

  const activeOrders = useMemo(
    () =>
      orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled")
        .length,
    [orders]
  );

  const tabs: { key: TabKey; label: string; icon: typeof HiOutlineSquares2X2; count: number }[] = [
    {
      key: "orders",
      label: "سفارش‌های من",
      icon: HiOutlineShoppingBag,
      count: orders.length,
    },
    {
      key: "designs",
      label: "گالری من",
      icon: HiOutlineSquares2X2,
      count: designs.length,
    },
    {
      key: "public",
      label: "منتشر شده در گالری",
      icon: HiOutlineGlobeAlt,
      count: publicDesigns.length,
    },
  ];

  const stats = [
    {
      label: "طرح‌های ذخیره شده",
      value: designs.length,
      icon: HiOutlinePaintBrush,
      iconClass: "bg-primary-100/80 text-primary-600",
    },
    {
      label: "منتشر شده در گالری",
      value: publicDesigns.length,
      icon: HiOutlineGlobeAlt,
      iconClass: "bg-emerald-100/80 text-emerald-600",
    },
    {
      label: "سفارش‌های در جریان",
      value: activeOrders,
      icon: HiOutlineShoppingBag,
      iconClass: "bg-accent/15 text-accent",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            خوش آمدید{userName ? `، ${userName}` : ""} 👋
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            داشبورد شخصی
          </h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            طرح‌ها و سفارش‌های خود را از اینجا مدیریت کنید.
          </p>
        </div>
        <Link
          href="/design"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.03]"
        >
          <HiOutlineSparkles className="size-4" />
          طراحی جدید
        </Link>
      </motion.header>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.08 * i }}
            className="flex items-center gap-4 rounded-[2rem] border border-white/80 bg-white/55 p-5 shadow-soft-rose backdrop-blur-xl"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconClass}`}
            >
              <stat.icon className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {stat.value.toLocaleString("fa-IR")}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap items-center gap-2 rounded-full border border-white/80 bg-white/45 p-1.5 backdrop-blur-xl sm:w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-colors sm:px-5 ${
                isActive
                  ? "text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="dashboard-active-tab"
                  transition={{ duration: 0.35, ease }}
                  className="absolute inset-0 rounded-full bg-accent shadow-md shadow-accent/25"
                />
              )}
              <tab.icon className="relative z-10 size-4" />
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                  isActive
                    ? "bg-white/25 text-accent-foreground"
                    : "bg-primary-100/80 text-muted-foreground"
                }`}
              >
                {tab.count.toLocaleString("fa-IR")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === "orders" &&
          (orders.length === 0 ? (
            <EmptyState
              icon={HiOutlineShoppingBag}
              title="هنوز سفارشی ثبت نکرده‌اید"
              description="اولین لباس خود را طراحی کنید و برای دوخت آن سفارش دهید."
              actionLabel="شروع طراحی"
              actionHref="/design"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))}
            </div>
          ))}

        {activeTab === "designs" &&
          (designs.length === 0 ? (
            <EmptyState
              icon={HiOutlinePaintBrush}
              title="گالری شما خالی است"
              description="طرح‌هایی که در مراحل طراحی ذخیره می‌کنید، اینجا نمایش داده می‌شوند."
              actionLabel="طراحی اولین لباس"
              actionHref="/design"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design, i) => (
                <DesignCard key={design.id} design={design} index={i} />
              ))}
            </div>
          ))}

        {activeTab === "public" &&
          (publicDesigns.length === 0 ? (
            <EmptyState
              icon={HiOutlineGlobeAlt}
              title="هنوز طرحی منتشر نکرده‌اید"
              description="از تب «گالری من» طرح‌های مورد علاقه خود را در گالری عمومی منتشر کنید تا دیگران هم آن‌ها را ببینند."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicDesigns.map((design, i) => (
                <DesignCard key={design.id} design={design} index={i} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
