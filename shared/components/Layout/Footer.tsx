import { LuInstagram, LuScissors } from "react-icons/lu";

export default function Footer() {
    return (
      <footer className="border-t border-border bg-secondary/20 py-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <LuScissors size={13} className="text-accent-foreground" />
                </div>
                <span className="text-lg font-black">تن‌بوم</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[260px] mb-6">
                پلتفرم طراحی لباس سفارشی ایران. از تخیل تا واقعیت.
              </p>
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-accent transition-colors">
                  <LuInstagram size={15} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            {[
              {
                title: "لینک‌های مهم",
                links: ["گالری طرح‌ها", "چطور کار می‌کنه", "قیمت‌گذاری", "درباره ما"],
              },
              {
                title: "پشتیبانی",
                links: ["سوالات متداول", "تماس با ما", "شرایط استفاده", "حریم خصوصی"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold mb-5 text-sm">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </footer>
    );
  }
  