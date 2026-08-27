import { updateTripInfo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Trip } from "@/lib/trip/types";

export function TripHeader({ trip }: { trip: Trip }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{trip.title}</h1>
          {(trip.periodStart || trip.periodEnd) && (
            <p className="text-sm text-muted-foreground">
              {trip.periodStart ?? "미정"} ~ {trip.periodEnd ?? "미정"}
            </p>
          )}
        </div>
        {trip.coverImage && (
          // 업로드된 이미지는 크기를 알 수 없어 next/image 대신 고정 크기 img로 보여준다.
          <img
            src={trip.coverImage}
            alt=""
            className="h-20 w-32 rounded-md object-cover"
          />
        )}
      </div>

      <details className="rounded-md border p-4">
        <summary className="cursor-pointer text-sm font-medium">
          여행 정보 수정
        </summary>
        <form
          action={updateTripInfo}
          encType="multipart/form-data"
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" name="title" defaultValue={trip.title} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="periodStart">시작일</Label>
            <Input
              id="periodStart"
              name="periodStart"
              type="date"
              defaultValue={trip.periodStart ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="periodEnd">종료일</Label>
            <Input
              id="periodEnd"
              name="periodEnd"
              type="date"
              defaultValue={trip.periodEnd ?? ""}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="coverImage">대표 이미지</Label>
            <Input id="coverImage" name="coverImage" type="file" accept="image/*" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">저장</Button>
          </div>
        </form>
      </details>
    </section>
  );
}
