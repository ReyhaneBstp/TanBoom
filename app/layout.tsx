import { GlobalLoading } from "@/shared/components/GlobalLoading";
import { GlobalSnackbar } from "@/shared/components/GlobalSnackbar";
import { auth } from "@/auth";
import { Metadata } from "next";
import Navbar from "@/shared/components/Layout/Navbar";
import Footer from "@/shared/components/Layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "طراحی لباس سفارشی",
  description: "صفحه تعاملی طراحی لباس سفارشی با جریان مرحله‌ای",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="fa" dir="rtl">
      <body className="...">
        <Navbar user={(session?.user)} />
        <main className="relative pt-15 pb-12 min-h-screen overflow-hidden bg-primary-mesh md:px-0 px-6 ">
          <section>{children}</section>
        </main>
        <Footer />
        <GlobalLoading />
        <GlobalSnackbar />
      </body>
    </html>
  );
}
