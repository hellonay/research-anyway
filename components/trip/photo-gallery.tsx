"use client";

import { useEffect, useState } from "react";

import { deleteInfoNotePhoto } from "@/app/actions";
import type { Photo } from "@/lib/trip/types";

// 정보 카드의 사진은 모바일에서 주로 확인하므로 가로 폭 꽉 채운 목록으로 보여주고,
// 탭하면 원본을 전체 화면으로 볼 수 있게 한다.
export function PhotoGallery({
  personId,
  noteId,
  photos,
}: {
  personId: string;
  noteId: string;
  photos: Photo[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedPhoto = photos.find((photo) => photo.id === expandedId) ?? null;

  useEffect(() => {
    if (!expandedPhoto) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setExpandedId(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedPhoto]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative">
            <button
              type="button"
              onClick={() => setExpandedId(photo.id)}
              className="block w-full"
            >
              <img src={photo.url} alt="" className="w-full rounded-md" />
            </button>
            <form
              action={deleteInfoNotePhoto.bind(null, personId, noteId, photo.id)}
              className="absolute -right-1.5 -top-1.5"
            >
              <button
                type="submit"
                aria-label="사진 삭제"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[11px] leading-none text-background"
              >
                ×
              </button>
            </form>
          </div>
        ))}
      </div>

      {expandedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setExpandedId(null)}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setExpandedId(null)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white"
          >
            ×
          </button>
          <img
            src={expandedPhoto.url}
            alt=""
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
