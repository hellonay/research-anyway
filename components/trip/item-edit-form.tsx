"use client";

import { useRef, useTransition } from "react";

import { updateItem } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ITEM_TYPES, type Item } from "@/lib/trip/types";

// 저장을 누르면 서버 액션을 직접 호출해 완료를 기다린 뒤 패널을 접고,
// 취소를 누르면 입력값을 되돌리고 패널만 접는다. 폼 제출을 브라우저에
// 맡기지 않고 여기서 처리하므로 action/encType 조합 대신 onSubmit을 쓴다.
export function ItemEditForm({ dayId, item }: { dayId: string; item: Item }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function close() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      await updateItem(dayId, item.id, formData);
      close();
    });
  }

  function handleCancel() {
    formRef.current?.reset();
    close();
  }

  return (
    <details ref={detailsRef}>
      <summary className="cursor-pointer text-sm font-medium">수정</summary>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-3 grid gap-3 sm:grid-cols-2"
      >
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`edit-title-${item.id}`}>제목</Label>
          <Input
            id={`edit-title-${item.id}`}
            name="title"
            defaultValue={item.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`edit-type-${item.id}`}>유형</Label>
          <select
            id={`edit-type-${item.id}`}
            name="type"
            defaultValue={item.type}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          >
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor={`edit-start-${item.id}`}>시작 시간</Label>
            <Input
              id={`edit-start-${item.id}`}
              name="startTime"
              type="time"
              defaultValue={item.startTime ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-end-${item.id}`}>종료 시간</Label>
            <Input
              id={`edit-end-${item.id}`}
              name="endTime"
              type="time"
              defaultValue={item.endTime ?? ""}
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`edit-note-${item.id}`}>메모</Label>
          <Textarea
            id={`edit-note-${item.id}`}
            name="note"
            rows={2}
            defaultValue={item.note ?? ""}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`edit-map-${item.id}`}>구글맵 링크</Label>
          <Input
            id={`edit-map-${item.id}`}
            name="mapUrl"
            type="url"
            defaultValue={item.mapUrl ?? ""}
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`edit-photos-${item.id}`}>사진 추가</Label>
          <Input
            id={`edit-photos-${item.id}`}
            name="photos"
            type="file"
            accept="image/*"
            multiple
          />
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" disabled={pending}>
            저장
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
        </div>
      </form>
    </details>
  );
}
