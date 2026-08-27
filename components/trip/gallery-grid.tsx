"use client";

import { useEffect, useState } from "react";
import { deleteGalleryPhoto } from "@/app/actions";
import type { GalleryPhoto } from "@/lib/trip/types";

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">아직 등록된 사진이 없습니다.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group space-y-1">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSelected(photo)}
                className="block w-full"
                aria-label="사진 크게 보기"
              >
                <img
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  className="aspect-square w-full rounded-md object-cover"
                />
              </button>
              <form
                action={deleteGalleryPhoto.bind(null, photo.id)}
                className="absolute -right-1.5 -top-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
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

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white hover:bg-white/20"
          >
            ×
          </button>
          <img
            src={selected.url}
            alt={selected.caption ?? ""}
            className="max-h-full max-w-full rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {selected.caption && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {selected.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
