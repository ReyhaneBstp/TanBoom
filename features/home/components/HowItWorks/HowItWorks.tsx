import { motion, steps } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ease } from "../../../../shared/definitions/motion";
import { designSteps } from "./definitions";
import { cn } from "@/shared/utils/mergeClasses";
import Image from "next/image";


  
export default function HowItWorks() {
    const { ref, visible } = useScrollReveal();
  
    return (
      <section
        id="how"
        ref={(el) => {
          (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        }}
        className="py-24 bg-secondary/30"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-accent/12 text-accent text-xs font-bold px-4 py-2 rounded-full mb-4"
            >
              فقط سه قدم
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-4"
            >
              چطور شروع کنم؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-muted-foreground text-lg max-w-sm mx-auto"
            >
              از تخیل تا واقعیت، در چند دقیقه.
            </motion.p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 relative">
            <div className="hidden md:block absolute top-[3.25rem] right-[17%] left-[17%] border-t-2 border-dashed border-border" />
            {designSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i + 0.25, ease }}
                className="group relative bg-card rounded-3xl p-8 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div
                  className={cn("w-[3.25rem] h-[3.25rem] rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110", step.bg , step.color)}
                >
                  <step.icon size={22} />
                </div>
                <div
                  className="text-5xl font-black mb-3"
                  style={{ color: "var(--border)" }}
                >
                  {step.num}
                </div>
                <h3 className="text-xl font-black mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
  
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-16 rounded-3xl overflow-hidden relative bg-muted"
          >
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=420&fit=crop&auto=format"
              alt="طراحی لباس"
              className="w-full h-44 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <p className="text-2xl md:text-4xl font-black mb-2">
                  خلاقیتت رو آزاد بذار
                </p>
                <p className="text-sm md:text-base text-white/75">
                  این‌جا هیچ مرزی بین تخیل و واقعیت نیست
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }
  