import { Metadata } from "next";
import { FaqView } from "@/features/faq/FaqView";

export const metadata: Metadata = {
  title: "سوالات متداول | تن‌بوم",
  description: "پاسخ پرتکرارترین سوالات درباره طراحی، سفارش و تحویل لباس در تن‌بوم",
};

export default function FaqPage() {
  return <FaqView />;
}
