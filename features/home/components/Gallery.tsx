import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { motion } from "motion/react";
import { LuArrowLeft, LuHeart, LuUsers } from "react-icons/lu";
import { galleryItems } from "../definitions/gallery";
import { ease } from "../../../shared/definitions/motion";

export function Gallery() {
    const { ref, visible } = useScrollReveal();
    const [hovId, setHovId] = useState<number | null>(null);
  
    return (
      <section
        id="gallery"
        ref={(el) => {
          (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                className="inline-flex items-center gap-2 bg-accent/12 text-accent text-xs font-bold px-4 py-2 rounded-full mb-4"
              >
                <LuUsers size={11} />
                شاید طراحی بقیه هم برات جالب باشه؟
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black"
              >
                ایده‌های بقیه رو سفارش بده
              </motion.h2>
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={visible ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-accent hover:gap-3.5 transition-all"
            >
              همه طرح‌ها <LuArrowLeft size={15} />
            </motion.button>
          </div>
  
          <div className="columns-2 md:columns-3 gap-4 md:gap-5 [column-gap:1rem] md:[column-gap:1.25rem]">
            {galleryItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={visible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.08 * i + 0.2, ease }}
                onMouseEnter={() => setHovId(item.id)}
                onMouseLeave={() => setHovId(null)}
                className="break-inside-avoid mb-4 md:mb-5 rounded-2xl overflow-hidden relative group cursor-pointer bg-muted"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-100 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent transition-opacity duration-300 ${
                    hovId === item.id ? "opacity-100" : "opacity-70"
                  }`}
                />
                <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                  <div className="text-[10px] font-medium opacity-70 mb-0.5">
                    {item.designer}
                  </div>
                  <div className="font-bold text-sm mb-2">{item.title}</div>
                  <div
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      hovId === item.id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    <span className="flex items-center gap-1 text-xs opacity-80">
                      <LuHeart size={11} /> {item.likes}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/90 text-foreground text-[11px] font-black px-3 py-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      سفارش بده
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }