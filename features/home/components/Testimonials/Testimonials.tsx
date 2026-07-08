import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { testimonials } from "./definitions";
import { LuStar } from "react-icons/lu";

export function Testimonials() {
    const { ref, visible } = useScrollReveal();
  
    return (
      <section
        ref={(el) => {
          (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        }}
        className="py-24 bg-secondary/25"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              className="text-4xl md:text-5xl font-black mb-3"
            >
              اونا می‌گن
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              تجربه واقعی کاربران تن‌بوم
            </motion.p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i + 0.2 }}
                className="bg-card rounded-3xl p-8 border border-border hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <LuStar
                      key={j}
                      size={14}
                      className="text-accent fill-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-loose mb-7">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-border"
                  />
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  