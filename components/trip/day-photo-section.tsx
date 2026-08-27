import { ChevronDown } from "lucide-react";
import { AddGalleryPhotosForm } from "@/components/trip/add-gallery-photos-form";
import { GalleryGrid } from "@/components/trip/gallery-grid";
import { panelColor } from "@/lib/trip/panel-colors";
import type { Day, GalleryPhoto } from "@/lib/trip/types";

export function DayPhotoSection({
  day,
  index,
  photos,
}: {
  day: Day;
  index: number;
  photos: GalleryPhoto[];
}) {
  const colors = panelColor(index);

  return (
    <section className={`rounded-lg border ${colors}`}>
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4">
          <span className="flex items-center gap-2">
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
            <h2 className="text-lg font-semibold">{day.label}</h2>
          </span>
          <span className="text-sm text-muted-foreground">{photos.length}장</span>
        </summary>

        <div className="space-y-3 border-t p-4">
          <GalleryGrid photos={photos} />
          <AddGalleryPhotosForm dayId={day.id} />
        </div>
      </details>
    </section>
  );
}
