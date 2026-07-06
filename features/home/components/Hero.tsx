import { motion } from "motion/react";
import {
  LuArrowLeft,
  LuChevronDown,
  LuHeart,
  LuPencil,
  LuSparkles,
} from "react-icons/lu";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-[-120px] w-[560px] h-[560px] rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-60px] w-[420px] h-[420px] rounded-full bg-secondary blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-card/50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="inline-flex items-center gap-2 bg-accent/12 text-accent text-xs font-bold px-4 py-2 rounded-full mb-7"
            >
              <LuSparkles size={11} />
              طراحی لباس با هوش مصنوعی
            </motion.div>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35, ease }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black leading-[1.1] mb-7"
            >
              لباس رویاتو
              <br />
              <span className="relative text-accent">
                طراحی کن
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-muted-foreground text-lg leading-loose mb-10 max-w-[440px]"
            >
              یه طرح بکش، ما اون رو به لباس واقعی تبدیل می‌کنیم. اگه پسندیدی،
              خیاطان متخصص ما برات می‌دوزنش و درِ خونه‌ات می‌رسونیمش.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62 }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group bg-accent text-accent-foreground font-black text-base px-8 py-4 rounded-2xl shadow-lg shadow-accent/20 flex items-center gap-3"
              >
                شروع طراحی رایگان
                <LuArrowLeft
                  size={17}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </motion.button>

              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <div className="flex -space-x-2 space-x-reverse">
                  {[
                    "1494790108377-be9c29b29330",
                    "1438761681033-6461ffad8d80",
                    "1534528741775-53994a69daeb",
                  ].map((id) => (
                    <img
                      key={id}
                      src={`https://images.unsplash.com/photo-${id}?w=32&h=32&fit=crop&auto=format`}
                      className="w-8 h-8 rounded-full border-2 border-background object-cover"
                      alt=""
                    />
                  ))}
                </div>
                +۱۲,۰۰۰ طراح فعال
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-12 pt-8 border-t border-border flex flex-wrap gap-8"
            >
              {[
                { val: "۴۸K+", lbl: "طرح خلق شده" },
                { val: "۱۲K+", lbl: "سفارش تحویل‌داده‌شده" },
                { val: "۹۸٪", lbl: "رضایت مشتریان" },
              ].map((s) => (
                <div key={s.lbl}>
                  <div className="text-2xl font-black text-accent">{s.val}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.lbl}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-[360px]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, delay: 0.45, ease }}
                className="-rotate-2"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-2xl bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=520&h=640&fit=crop&auto=format"
                    alt="مدل لباس"
                    className="w-full h-[400px] sm:h-[460px] object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: [0, -12, 0],
                  scale: 1,
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 1.2 },
                  scale: { duration: 0.6, delay: 1.2 },

                  y: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute -bottom-5 -right-4 sm:-right-10 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <LuHeart size={15} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">
                      سفارش جدید!
                    </div>
                    <div className="text-sm font-bold">پیراهن پاییزی</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: [0, -12, 0],
                  scale: 1,
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 1.2 },
                  scale: { duration: 0.6, delay: 1.2 },

                  y: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute -top-4 -left-4 sm:-left-10 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <LuPencil size={14} className="text-accent" />
                  <span className="text-sm font-bold">طرح دست‌کشیده</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <span>→</span> لباس واقعی
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
          بیشتر
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <LuChevronDown size={15} className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
