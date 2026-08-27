import { deleteGalleryPhoto } from "@/app/actions";
import type { GalleryPhoto } from "@/lib/trip/types";

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">아직 등록된 사진이 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {photos.map((photo) => (
        <div key={photo.id} className="space-y-1">
          <div className="relative">
            <img
              src={photo.url}
              alt={photo.caption ?? ""}
              className="aspect-square w-full rounded-md object-cover"
            />
            <form
              action={deleteGalleryPhoto.bind(null, photo.id)}
              className="absolute -right-1.5 -top-1.5"
            >
              <button
                type="submit"
                aria-label="사진 삭제"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-sm leading-none text-background"
              >
                ×
              </button>
            </form>
          </div>
          {photo.caption && (
            <p className="truncate text-xs text-muted-foreground">{photo.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}
