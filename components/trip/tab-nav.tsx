"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

const TABS = [
  { href: "/", label: "일정" },
  { href: "/info", label: "정보" },
  { href: "/photos", label: "사진" },
] as const;

export function TabNav() {
  const pathname = usePathname();

  // 로그인 화면에는 탭을 보여주지 않는다.
  if (pathname === "/login") return null;

  return (
    <nav className="sticky top-0 z-10 flex border-b bg-background">
      <div className="grid flex-1 grid-cols-3">
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
      </div>
      <form action={logout} className="flex items-center border-l px-2">
        <Button type="submit" variant="ghost" size="sm">
          로그아웃
        </Button>
      </form>
    </nav>
  );
}
