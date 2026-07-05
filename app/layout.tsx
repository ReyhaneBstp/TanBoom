import { GlobalLoading } from "@/shared/components/GlobalLoading";
import { GlobalSnackbar } from "@/shared/components/GlobalSnackbar";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "طراحی لباس سفارشی",
  description: "صفحه تعاملی طراحی لباس سفارشی با جریان مرحله‌ای",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="...">
        <main className="relative min-h-screen overflow-hidden bg-primary-mesh px-4 py-6 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary-300/90 blur-3xl to-transparent" />
          <div className="absolute -left-24 bottom-16 -z-10 size-72 rounded-full bg-primary-300/90 blur-3xl to-transparent" />
          <div className="absolute -right-16 bottom-20 -z-10 size-72 rounded-full bg-primary-300/90 blur-3xl to-transparent" />
          <div className="absolute -left-16 bottom-20 -z-10 size-72 rounded-full bg-primary-300/90 blur-3xl to-transparent" />
          


          <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center">
            {children}
            <GlobalLoading />
            <GlobalSnackbar />
          </section>
        </main>
      </body>
    </html>
  );
}
