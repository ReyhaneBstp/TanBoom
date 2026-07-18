"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronDown,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { ease } from "@/shared/definitions/motion";
import { faqCategories } from "./definitions";

function FaqRow({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/55 backdrop-blur-xl overflow-hidden transition-shadow hover:shadow-soft-primary">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
      >
        <span className="text-sm font-bold text-foreground sm:text-base">
          {question}
        </span>
        <HiOutlineChevronDown
          className={`size-5 shrink-0 text-primary-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqView() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="text-center mb-12"
      >
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <HiOutlineQuestionMarkCircle className="size-7" />
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          سوالات متداول
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground max-w-md mx-auto">
          جواب پرتکرارترین سوال‌ها درباره‌ی طراحی، سفارش و تحویل لباس در تن‌بوم
          رو اینجا پیدا می‌کنی.
        </p>
      </motion.header>

      <div className="space-y-10">
        {faqCategories.map((category, catIndex) => (
          <motion.section
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.08 * catIndex }}
          >
            <h2 className="mb-4 text-lg font-black text-primary-700">
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.items.map((item, itemIndex) => {
                const key = `${catIndex}-${itemIndex}`;
                return (
                  <FaqRow
                    key={key}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openKey === key}
                    onToggle={() =>
                      setOpenKey(openKey === key ? null : key)
                    }
                  />
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease, delay: 0.4 }}
        className="mt-14 rounded-[2rem] border border-white/80 bg-white/55 backdrop-blur-xl p-8 text-center"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <HiOutlineChatBubbleLeftRight className="size-6" />
        </div>
        <h3 className="text-lg font-black">جوابت رو پیدا نکردی؟</h3>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          راهنمای کامل طراحی رو بخون یا همین الان اولین طرحت رو شروع کن.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/guide"
            className="inline-flex rounded-full border border-primary-600 bg-white/55 px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-white"
          >
            راهنمای طراحی
          </Link>
          <Link
            href="/design"
            className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.03]"
          >
            شروع طراحی
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
