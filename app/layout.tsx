import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "طراحی لباس سفارشی",
  description: "صفحه تعاملی طراحی لباس سفارشی با جریان مرحله‌ای"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
