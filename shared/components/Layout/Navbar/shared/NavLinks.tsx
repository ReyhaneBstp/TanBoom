import Link from "next/link";
import { NAV_LINKS } from "../definitions";

interface NavLinksProps {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}

export function NavLinks({ className, linkClassName, onNavigate }: NavLinksProps) {
  return (
    <div className={className}>
      {NAV_LINKS.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={linkClassName}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
