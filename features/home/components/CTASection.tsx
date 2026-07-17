
import Motion from "@/shared/components/Motion";
import { ease } from "@/shared/definitions/motion";
import { LuArrowLeft } from "react-icons/lu";


export function CTASection() {
  return (
    <section className="py-24 px-5 sm:px-8">
      <Motion
        as="div"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
        className="max-w-4xl mx-auto bg-primary-700/80 rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden"
      >

        <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/10 translate-y-1/3 -translate-x-1/4" />

        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            اولین طرحت رو
            <br />
            همین الان بکش!
          </h2>
          <p className="text-white/75 text-base mb-10 max-w-sm mx-auto leading-loose">
            هیچ کارت بانکی‌ای لازم نیست. فقط بیا و خلاقیتت رو آزاد کن.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Motion
              as="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-white text-primary font-black text-base px-10 py-4 rounded-2xl shadow-xl"
            >
              ثبت‌نام رایگان
            </Motion>
            <button className="text-white/85 font-medium hover:text-white transition-colors flex items-center gap-2 text-sm">
              گالری طرح‌ها رو ببین <LuArrowLeft size={14} />
            </button>
          </div>
        </div>
      </Motion>
    </section>
  );
}