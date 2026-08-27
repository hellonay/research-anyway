import { PageContainer } from "@/components/trip/page-container";

// 탭 전환 시 서버가 최신 데이터를 다시 읽는 동안(force-dynamic) 즉시 보여줄 스켈레톤.
// 이게 없으면 응답이 올 때까지 화면이 멈춘 것처럼 보인다.
export default function Loading() {
  return (
    <PageContainer>
      <div className="h-7 w-40 animate-pulse rounded bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </PageContainer>
  );
}
