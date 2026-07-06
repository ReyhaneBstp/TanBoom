import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { LuArrowLeft, LuStar } from "react-icons/lu";
import { ease } from "../../../shared/definitions/motion";

export function ForDesigners() {
    const { ref, visible } = useScrollReveal();
  
    return (
      <section
        id="designers"
        ref={(el) => {
          (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        }}
        className="py-24 bg-foreground text-background"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs font-bold px-4 py-2 rounded-full mb-6"
              >
                <LuStar size={11} />
                برای طراحان
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black mb-6 text-background leading-tight"
              >
                لباست تنِ
                <br />
                دنیا بشه
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-background/65 text-base leading-loose mb-10 max-w-[420px]"
              >
                طرح‌هایی که می‌کشی رو با جامعه به اشتراک بذار. وقتی یه نفر سفارش
                لباست رو بده، یه حس بی‌نظیر داری که خلاقیتت واقعی شده.
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
                  "در جامعه طراحان ایران معروف بشو",
                  "آنالیتیک دقیق برای رشد بیشتر",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 14 }}
                    animate={visible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.32 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent/25 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </div>
                    <span className="text-background/75 text-sm">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
  
              <motion.button
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-accent text-accent-foreground font-black px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-accent/20"
              >
                همین الان شروع کن
                <LuArrowLeft size={17} />
              </motion.button>
            </div>
  
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.3, ease }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=660&h=720&fit=crop&auto=format"
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
                className="absolute -bottom-5 -right-4 sm:-right-8 bg-card text-foreground rounded-2xl px-5 py-4 shadow-2xl border border-border/10"
              >
                <div className="text-2xl font-black text-accent">۸۷٪</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  طراحان راضی از درآمدشون
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
  