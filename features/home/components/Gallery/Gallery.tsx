import { LuArrowLeft, LuUsers } from "react-icons/lu";
import Link from "next/link";
import { galleryItems } from "./definitions";
import { ease } from "@/shared/definitions/motion";
import Image from "next/image";
import Motion from "@/shared/components/Motion";


export function Gallery() {
  return (
    <section id="gallery" className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <Motion
              as="div"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              className="inline-flex items-center gap-2 bg-accent/12 text-accent text-xs font-bold px-4 py-2 rounded-full mb-4"
            >
              <LuUsers size={11} />
              شاید طراحی بقیه هم برات جالب باشه؟
            </Motion>
            <Motion
              as="h2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black"
            >
              ایده‌های بقیه رو  اینجا ببین!
            </Motion>
          </div>
          <Motion
            as="div"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block"
          >
            <Link
              href="/gallery"
              className="flex items-center gap-2 text-sm font-bold text-accent hover:gap-3.5 transition-all"
            >
              همه طرح‌ها <LuArrowLeft size={15} />
            </Link>
          </Motion>
        </div>
        <div className="columns-1 md:columns-3 gap-4 md:gap-5 [column-gap:1rem] md:[column-gap:1.25rem]">
          {galleryItems.map((item, i) => (
            <Motion
              key={item.id}
              as="div"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.08 * i + 0.2, ease }}
              className="break-inside-avoid mb-4 md:mb-5 rounded-2xl overflow-hidden relative group cursor-pointer bg-muted"
            >
              <Image
                src={item.image}
                alt={item.title}
                className="w-full h-100 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                <div className="flex items-center justify-between gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <div className="font-bold text-sm mb-2">{item.title}</div>
                </div>
                <div className="text-[10px] font-medium opacity-70 mb-0.5">
                  {item.designer}
                </div>
              </div>
            </Motion>
          ))}
        </div>
      </div>
    </section>
  );
}