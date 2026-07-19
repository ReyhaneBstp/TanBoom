import Link from "next/link";
import { LuScissors } from "react-icons/lu";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group mr-2">
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
        <LuScissors size={13} className="text-accent-foreground" />
      </div>
      <span className="text-lg font-black tracking-tight">تن‌بوم</span>
    </Link>
  );
}
