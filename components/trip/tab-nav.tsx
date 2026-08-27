"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "일정" },
  { href: "/info", label: "정보" },
  { href: "/photos", label: "사진" },
] as const;

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 grid grid-cols-3 border-b bg-background">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={
              "border-b-2 py-3 text-center text-sm font-medium " +
              (active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground")
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
