import Image from "next/image";
import { motion } from "motion/react";
import { LuArrowLeft, LuSparkles } from "react-icons/lu";


import HeroImage from "@/assets/hero.png";

import { Button } from "@/shared/components/Button";
import { ease, fade } from "@/shared/definitions/motion";
import {
  avatars,
  features,
  floatingAnimation,
  floatingCards,
} from "./definitions";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-[-120px] h-[560px] w-[560px] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-60px] h-[420px] w-[420px] rounded-full bg-secondary blur-2xl" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-card/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full bg-primary/12 px-4 py-2 text-xs font-bold text-primary"
            >
              <LuSparkles size={11} />
              لباس‌هایی به سبک تو
            </motion.div>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35, ease }}
              className="mb-7 text-5xl font-black leading-[1.1] sm:text-6xl lg:text-[4.5rem]"
            >
              رویاهات رو
              <br />
              <span className="relative text-primary">
                به تن کن
                <svg
                  className="absolute -bottom-1 right-0 w-full"
                  viewBox="0 0 320 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10 C90 3 230 3 316 10"
                    stroke="#C17B5C"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fade}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-10 max-w-[460px] text-lg leading-loose text-muted-foreground"
            >
              هر ایده‌ای که برای لباس دلخواهت داری رو روی کاغذ بکش، ما اونو به
              یک تجسم واقعی تبدیل می‌کنیم و بهت نشونش می‌دیم. بعد از تأییدت،
              خیاطان حرفه‌ای ما با عشق و دقت برات می‌دوزنش و به دستت رسونده
              می‌شه.
            </motion.p>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.6, delay: 0.62 }}
              className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group gap-3"
                >
                  شروع طراحی رایگان
                  <LuArrowLeft
                    size={17}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </motion.button>
              </Button>

              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <div className="flex -space-x-2 space-x-reverse">
                  {avatars.map((id) => (
                    <img
                      key={id}
                      src={`https://images.unsplash.com/photo-${id}?w=32&h=32&fit=crop&auto=format`}
                      alt=""
                      className="h-8 w-8 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                به جمع ما اضافه شو!
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-12 flex flex-wrap gap-8 border-t border-border pt-8"
            >
              {features.map((feature) => (
                <div key={feature.title}>
                  <div className="text-lg font-black text-primary">
                    {feature.title}
                  </div>

                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <div className="relative w-full max-w-[460px]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, delay: 0.45, ease }}
                // className="-rotate-2"
              >
                <div>
                  <Image
                    src={HeroImage}
                    alt="مدل لباس"
                    className="h-[400px] w-full object-cover sm:h-[460px]"
                  />
                </div>
              </motion.div>

              {floatingCards.map(({ Icon, title, subtitle, className }) => (
                <motion.div
                  key={title}
                  {...floatingAnimation}
                  className={`${className} rounded-2xl border border-border bg-card px-4 py-3 shadow-xl`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15">
                      <Icon size={15} className="text-primary" />
                    </div>

                    <div>
                      <div className="text-[10px] text-muted-foreground">
                        {title}
                      </div>

                      <div className="text-sm font-bold">{subtitle}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
