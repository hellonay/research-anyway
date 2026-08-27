"use client";

import { useRef, useTransition } from "react";

import { addGalleryPhotos } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 올리기를 누르면 서버 액션을 직접 호출해 완료를 기다린 뒤 입력값을 비우고
// 패널을 접는다. 폼 제출을 브라우저에 맡기지 않고 여기서 처리하므로
// action/encType 조합 대신 onSubmit을 쓴다.
export function AddGalleryPhotosForm({ dayId }: { dayId: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      await addGalleryPhotos(dayId, formData);
      formRef.current?.reset();
      if (detailsRef.current) detailsRef.current.open = false;
    });
  }

  return (
    <details ref={detailsRef} className="rounded-md border border-dashed p-3">
      <summary className="cursor-pointer text-sm font-medium">사진 추가</summary>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor={`gallery-photos-${dayId}`}>사진 올리기</Label>
          <Input
            id={`gallery-photos-${dayId}`}
            name="photos"
            type="file"
            accept="image/*"
            multiple
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`gallery-caption-${dayId}`}>설명(선택, 여러 장을 한번에 올리면 모두에 붙는다)</Label>
          <Input id={`gallery-caption-${dayId}`} name="caption" placeholder="예: 저녁 식사" />
        </div>
        <Button type="submit" disabled={pending}>
          올리기
        </Button>
      </form>
    </details>
  );
}
