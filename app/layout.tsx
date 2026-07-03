import { GlobalLoading } from "@/shared/components/GlobalLoading";
import { GlobalSnackbar } from "@/shared/components/GlobalSnackbar";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "طراحی لباس سفارشی",
  description: "صفحه تعاملی طراحی لباس سفارشی با جریان مرحله‌ای"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="...">
        {children}
        <GlobalLoading />
        <GlobalSnackbar />
      </body>
    </html>
  );
}