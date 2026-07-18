"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
  HiOutlinePaintBrush,
  HiOutlinePencilSquare,
  HiOutlineSparkles,
  HiOutlineSwatch,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { ease } from "@/shared/definitions/motion";

const sections = [
  {
    icon: HiOutlinePencilSquare,
    title: "۱. اسکچ تمیز و واضح بکش",
    intro:
      "اسکچ تو مهم‌ترین ورودی هوش مصنوعیه؛ هرچی خطوط واضح‌تر باشن، ساختار لباس دقیق‌تر بازسازی می‌شه.",
    dos: [
      "با خودکار یا مداد پررنگ روی کاغذ سفید و ساده بکش",
      "از کل لباس یک نمای روبه‌رو بکش؛ سیلوئت (فرم کلی) کاملاً مشخص باشه",
      "خطوط اصلی مثل یقه، آستین، دوخت‌ها، دکمه‌ها و چین‌ها رو مشخص کن",
      "موقع عکس گرفتن از اسکچ، نور کافی داشته باش و عمود از بالا عکس بگیر",
    ],
    donts: [
      "اسکچ کم‌رنگ یا با خطوط شلوغ و چندباره کشیده‌شده",
      "عکس تار، کج یا با سایه‌ی دست و موبایل",
      "کشیدن چند طرح مختلف در یک برگه",
      "پس‌زمینه‌ی شلوغ مثل کاغذ خط‌دار یا چهارخونه",
    ],
  },
  {
    icon: HiOutlinePaintBrush,
    title: "۲. توضیحات رو دقیق و جزئی بنویس",
    intro:
      "توضیحات متنی مکمل اسکچه؛ چیزهایی که تو نقاشی معلوم نیست رو اینجا بگو. هوش مصنوعی دقیقاً همون چیزی رو می‌سازه که توصیف کردی.",
    dos: [
      "نوع یقه رو مشخص کن: گرد، هفت، ایستاده، انگلیسی و…",
      "مدل آستین رو بگو: کوتاه، بلند، پفی، سه‌ربع، کلوش و…",
      "قد لباس رو توصیف کن: تا کمر، تا باسن، تا زانو، ماکسی",
      "جزئیات خاص رو بگو: جیب، زیپ، دکمه، کمربند، چاک، چین یا پیلی",
      "حالت لباس رو توصیف کن: جذب، آزاد، اورسایز، کلوش",
    ],
    donts: [
      "توضیحات خیلی کلی مثل «یه لباس خوشگل» یا «یه مانتو شیک»",
      "توصیف‌های متناقض با اسکچ (مثلاً تو نقاشی آستین کوتاهه ولی می‌نویسی آستین بلند)",
      "درخواست چند مدل مختلف در یک توضیح",
    ],
  },
  {
    icon: HiOutlineSwatch,
    title: "۳. پارچه و رنگ رو هوشمندانه انتخاب کن",
    intro:
      "جنس پارچه روی حالت ایستایی، درخشش و چین‌خوردگی لباس در تصویر نهایی تأثیر مستقیم داره.",
    dos: [
      "برای هر قسمت لباس مشخص کن کدوم پارچه استفاده بشه (مثلاً «حریر فقط برای آستین‌ها»)",
      "رنگ‌ها رو از پالت انتخاب کن تا دقیقاً همون رنگی که می‌خوای تولید بشه",
      "اگه لباس چندتیکه‌ست، برای هر تیکه پارچه و رنگ جدا تعریف کن",
      "جنس پارچه رو متناسب با مدل انتخاب کن؛ مثلاً ساتن برای لباس مجلسی، لینن برای لباس راحتی",
    ],
    donts: [
      "انتخاب تعداد زیادی پارچه بدون مشخص‌کردن جای استفاده‌شون",
      "ترکیب رنگ‌های خیلی زیاد که تصویر رو شلوغ می‌کنه",
    ],
  },
  {
    icon: HiOutlineSparkles,
    title: "۴. اکسسوری‌ها رو با جای دقیق مشخص کن",
    intro:
      "اکسسوری‌ها و تزئینات، امضای شخصی لباس تو هستن — ولی فقط وقتی درست جانمایی بشن.",
    dos: [
      "برای هر اکسسوری محل دقیقش رو بنویس (مثلاً «مروارید روی لبه‌ی یقه»)",
      "از تزئینات کم ولی هدفمند استفاده کن",
      "اکسسوری رو در اسکچ هم بکش تا با توضیحاتت هم‌خوانی داشته باشه",
    ],
    donts: [
      "انتخاب اکسسوری بدون مشخص‌کردن محل قرارگیری",
      "اضافه‌کردن تزئینات زیاد که تمرکز رو از خود لباس می‌گیره",
    ],
  },
  {
    icon: HiOutlineLightBulb,
    title: "۵. اندازه‌ها و تکرار هوشمندانه",
    intro:
      "اگه از نتیجه‌ی اول راضی نشدی، نگران نباش! چند تکرار کوتاه با اصلاح توضیحات معمولاً به بهترین نتیجه می‌رسه.",
    dos: [
      "اندازه‌های واقعی (قد لباس، دور سینه، کمر و باسن) رو وارد کن تا تناسبات درست باشه",
      "بعد از هر تولید، نتیجه رو با اسکچت مقایسه کن و فقط بخش اشتباه رو در توضیحات دقیق‌تر کن",
      "تغییرات رو یکی‌یکی اعمال کن تا بفهمی هر تغییر چه اثری داره",
      "وقتی به نتیجه‌ی دلخواه رسیدی، طرح رو ذخیره کن تا از دستش ندی",
    ],
    donts: [
      "تغییر همه‌چیز به‌صورت هم‌زمان بعد از یک نتیجه‌ی نامطلوب",
      "کپی همون توضیحات قبلی و انتظار نتیجه‌ی متفاوت",
    ],
  },
];

const exampleGood =
  "«مانتوی جلوباز بلند تا ساق پا، یقه انگلیسی، آستین بلند ساده با سرآستین برگردان، دو جیب فیلتابی در طرفین، کمربند پارچه‌ای از جنس خود لباس، حالت نیمه‌آزاد»";

const exampleBad = "«یه مانتوی خوشگل و شیک می‌خوام»";

export function GuideView() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="text-center mb-14"
      >
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <HiOutlineLightBulb className="size-7" />
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl leading-tight">
          چطور از طراحی لباس
          <br className="sm:hidden" />
          <span className="text-primary"> خروجی قوی‌تر </span>
          بگیریم؟
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground max-w-lg mx-auto">
          کیفیت تصویر نهایی لباست مستقیماً به کیفیت ورودی‌هایی که بهمون می‌دی
          بستگی داره. با رعایت این ۵ اصل ساده، هوش مصنوعی دقیقاً همون لباسی رو
          می‌سازه که تو ذهنته.
        </p>
      </motion.header>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease, delay: 0.05 * i }}
            className="rounded-[2rem] border border-white/80 bg-white/55 backdrop-blur-xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100/80 text-primary-600">
                <section.icon className="size-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-black">{section.title}</h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground mb-6">
              {section.intro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-4">
                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                  <HiOutlineCheckCircle className="size-5" />
                  <span className="text-sm font-black">این کارها رو بکن</span>
                </div>
                <ul className="space-y-2.5">
                  {section.dos.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs leading-6 text-foreground/80"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-red-50/70 border border-red-100 p-4">
                <div className="flex items-center gap-2 mb-3 text-red-500">
                  <HiOutlineXCircle className="size-5" />
                  <span className="text-sm font-black">از اینا دوری کن</span>
                </div>
                <ul className="space-y-2.5">
                  {section.donts.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs leading-6 text-foreground/80"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* نمونه‌ی توصیف خوب و بد */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease }}
        className="mt-8 rounded-[2rem] border border-white/80 bg-white/55 backdrop-blur-xl p-6 sm:p-8"
      >
        <h2 className="text-lg sm:text-xl font-black mb-6">
          یک مثال واقعی: توصیف خوب در برابر توصیف ضعیف
        </h2>
        <div className="space-y-4">
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-5">
            <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <HiOutlineCheckCircle className="size-5" />
              <span className="text-sm font-black">توصیف قوی</span>
            </div>
            <p className="text-sm leading-8 text-foreground/85">{exampleGood}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              نوع لباس، قد، یقه، آستین، جیب، کمربند و حالت — همه مشخصه. هوش
              مصنوعی چیزی برای حدس‌زدن نداره.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50/70 border border-red-100 p-5">
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <HiOutlineXCircle className="size-5" />
              <span className="text-sm font-black">توصیف ضعیف</span>
            </div>
            <p className="text-sm leading-8 text-foreground/85">{exampleBad}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              «خوشگل» و «شیک» برای هوش مصنوعی معنای دقیقی نداره؛ نتیجه کاملاً
              شانسی می‌شه.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease }}
        className="mt-12 rounded-[2rem] bg-primary-700/80 p-10 text-center relative overflow-hidden"
      >
        <div className="pointer-events-none absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4" />
        <div className="relative">
          <h3 className="text-2xl font-black text-white mb-3">
            حالا که فوت‌وفنش رو یاد گرفتی…
          </h3>
          <p className="text-white/75 text-sm mb-8">
            وقتشه اولین طرح حرفه‌ای‌ت رو بسازی!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/design"
              className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-black text-primary shadow-xl transition-transform hover:scale-[1.03]"
            >
              شروع طراحی
            </Link>
            <Link
              href="/faq"
              className="inline-flex text-sm font-medium text-white/85 hover:text-white transition-colors px-4 py-3.5"
            >
              سوالات متداول رو ببین
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
