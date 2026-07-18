import { LuArrowLeft, LuStar } from "react-icons/lu";
import DesignerImage from "@/assets/landing/designer.webp";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/Button";
import Motion from "@/shared/components/Motion";


export function ForDesigners() {
  return (
    <section id="designers" className="py-24 bg-primary/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <Motion
              as="div"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6"
            >
              <LuStar size={11} />
              طرحت رو با بقیه به اشتراک بذار
            </Motion>

            <Motion
              as="h2"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-6 text-primary-700 leading-tight"
            >
              میتونه طرحت تنِ
              <br />
              دنیا باشه
            </Motion>

            <Motion
              as="p"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-base leading-loose mb-10 max-w-[420px]"
            >
              این‌جا این امکان وجود داره که اگه خودت تایید کنی طراحی‌هات برای بقیه هم توی گالری تن‌بوم نمایش داده بشه. شاید ایده‌ی تو،
              لباس ایده‌آل کسی باشه!
        
              
            </Motion>

            <Motion
              as="ul"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.3 }}
              className="space-y-3.5 mb-10"
            >
              {[
                "بدون دغدغه‌ی تولید، نمونه‌ی دیجیتال بساز",
                "طرح‌هات رو با همه به اشتراک بذار",
                "از طرح‌های بقیه الهام بگیر",
              ].map((item, i) => (
                <Motion
                  as="li"
                  key={i}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: 0.32 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/25 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground/75 text-sm">
                    {item}
                  </span>
                </Motion>
              ))}
            </Motion>

            <Button asChild size="lg">
              <Motion
                as="div"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href="/design" className="flex items-center gap-2">
                  همین الان شروع کن
                  <LuArrowLeft size={17} />
                </Link>
              </Motion>
            </Button>
          </div>
          <Motion
            as="div"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden bg-muted">
              <Image
                src={DesignerImage}
                alt="طراح در حال کار"
                className="w-full h-[460px] md:h-[520px] object-cover"
              />
            </div>
            <Motion
              as="div"
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
            </Motion>
          </Motion>
        </div>
      </div>
    </section>
  );
}