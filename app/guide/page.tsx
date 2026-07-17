import { Metadata } from "next";
import { GuideView } from "@/features/guide/GuideView";

export const metadata: Metadata = {
  title: "راهنمای طراحی | تن‌بوم",
  description:
    "راهنمای کامل گرفتن خروجی قوی‌تر از طراحی لباس با هوش مصنوعی در تن‌بوم",
};

export default function GuidePage() {
  return <GuideView />;
}
