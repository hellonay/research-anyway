import { AddDayForm } from "@/components/trip/add-day-form";
import { DaySection } from "@/components/trip/day-section";
import { PageContainer } from "@/components/trip/page-container";
import { TripHeader } from "@/components/trip/trip-header";
import { readTrip } from "@/lib/trip/store";

// 매 요청마다 로컬 JSON 파일에서 최신 상태를 읽어야 하므로 정적 렌더링을 쓰지 않는다.
export const dynamic = "force-dynamic";

export default async function Home() {
  const trip = await readTrip();

  return (
    <PageContainer>
      <TripHeader trip={trip} />
      <AddDayForm />
      <div className="space-y-4">
        {trip.days.map((day) => (
          <DaySection key={day.id} day={day} />
        ))}
      </div>
    </PageContainer>
  );
}
