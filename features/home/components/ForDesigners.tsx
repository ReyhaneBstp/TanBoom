import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { LuArrowLeft, LuStar } from "react-icons/lu";
import { ease } from "../../../shared/definitions/motion";
import DesignerImage from "@/assets/designer.png";
import Image from "next/image";
import { Button } from "@/shared/components/Button";

export function ForDesigners() {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="designers"
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="py-24 bg-primary/8"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6"
            >
              <LuStar size={11} />
              طرحت رو با بقیه به اشتراک بذار
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-6 text-primary-700 leading-tight"
            >
              میتونه طرحت تنِ
              <br />
              دنیا باشه
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-base leading-loose mb-10 max-w-[420px]"
            >
              این‌جا این امکان وجود داره که طرح‌هایی که کشیدی رو با بقیه هم به اشتراک بذاری. شاید ایده‌‌ی تو،
              لباس ایده‌آل کسی باشه!
              <br />
              جالبه بدونی اگه کسی طرح تو رو سفارش بده، به ازای هر سفارش ۱۰٪ از قیمت اون لباس برای تو می‌شه.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={visible ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-3.5 mb-10"
            >
              {[
                "طرح‌هات رو با همه به اشتراک بذار",
                "از هر سفارش درآمد کسب کن",
                "در جامعه طراحان معروف‌ شو",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 14 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.32 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/25 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground/75 text-sm">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <Button asChild size="lg">
              <motion.button
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                همین الان شروع کن
                <LuArrowLeft size={17} />
              </motion.button>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.3, ease }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden bg-muted">
              <Image
                src={DesignerImage}
                alt="طراح در حال کار"
                className="w-full h-[460px] md:h-[520px] object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 md:-left-4 md:right-auto -right-8 bg-card text-foreground rounded-2xl px-5 py-4 shadow-2xl border border-border/10"
            >
              <div className="text-[11px] text-muted-foreground mt-0.5">
                پس بیا لباسامون رو قشنگ‌تر کن :)
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
