"use client";


import { ease } from "@/shared/definitions/motion";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { LuMenu, LuScissors, LuX } from "react-icons/lu";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
  
    useEffect(() => {
      const fn = () => setScrolled(window.scrollY > 24);
      window.addEventListener("scroll", fn);
      return () => window.removeEventListener("scroll", fn);
    }, []);
  
    return (
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/85 backdrop-blur-lg border-b border-border shadow-sm"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">

          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <LuScissors size={13} className="text-accent-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight">تن‌بوم</span>
          </a>
  
 
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              ["چطور کار می‌کنه؟", "#how"],
              ["گالری طرح‌ها", "#gallery"],
              ["برای طراحان", "#designers"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
  
 
          <div className="flex items-center gap-3">
            <button className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              ورود
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-accent text-accent-foreground text-sm font-bold px-5 py-2.5 rounded-full shadow-md shadow-accent/25"
            >
              شروع طراحی
            </motion.button>
            <button
              className="md:hidden p-1 text-foreground"
              onClick={() => setOpen(!open)}
            >
              {open ? <LuX size={20} /> : <LuMenu size={20} />}
            </button>
          </div>
        </div>
  

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background border-b border-border px-6 pb-5 pt-2 flex flex-col gap-4"
          >
            {[
              ["چطور کار می‌کنه؟", "#how"],
              ["گالری طرح‌ها", "#gallery"],
              ["برای طراحان", "#designers"],
              ["ورود", "#"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </motion.nav>
    );
  }