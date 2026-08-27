import { DayPhotoSection } from "@/components/trip/day-photo-section";
import { GalleryGrid } from "@/components/trip/gallery-grid";
import { PageContainer } from "@/components/trip/page-container";
import { readTrip } from "@/lib/trip/store";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const trip = await readTrip();
  // dayId가 없는 사진은 Day 구조가 생기기 전에 올라간 기존 데이터다.
  const unassignedPhotos = trip.galleryPhotos.filter((p) => !p.dayId);

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold tracking-tight">사진</h1>

      {trip.days.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 등록된 Day가 없습니다. 일정 탭에서 Day를 먼저 추가해주세요.
        </p>
      ) : (
        <div className="space-y-4">
          {trip.days.map((day, index) => (
            <DayPhotoSection
              key={day.id}
              day={day}
              index={index}
              photos={trip.galleryPhotos.filter((p) => p.dayId === day.id)}
            />
          ))}
        </div>
      )}

      {unassignedPhotos.length > 0 && (
        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Day 미지정</h2>
          <GalleryGrid photos={unassignedPhotos} />
        </section>
      )}
    </PageContainer>
  );
}
