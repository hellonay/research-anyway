import type { ReactNode } from "react";

// 세 탭 페이지가 공유하는 모바일 우선 레이아웃(좁은 화면 기본, sm 이상에서 여유 있게 확장).
export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-10">
      {children}
    </div>
  );
}
