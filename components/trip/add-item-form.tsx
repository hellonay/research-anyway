"use client";

import { useRef, useTransition } from "react";

import { addItem } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ITEM_TYPES } from "@/lib/trip/types";

// 적용을 누르면 서버 액션을 직접 호출해 완료를 기다린 뒤 패널을 접고,
// 취소를 누르면 입력값만 비우고 패널을 접는다. 폼 제출을 브라우저에
// 맡기지 않고 여기서 처리하므로 action/encType 조합 대신 onSubmit을 쓴다.
export function AddItemForm({ dayId }: { dayId: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function close() {
    formRef.current?.reset();
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      await addItem(dayId, formData);
      close();
    });
  }

  return (
    <details ref={detailsRef}>
      <summary
        className={buttonVariants({
          size: "sm",
          className: "cursor-pointer list-none",
        })}
      >
        + 추가
      </summary>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-3 grid gap-3 rounded-md border border-dashed p-3 sm:grid-cols-2"
      >
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`title-${dayId}`}>제목</Label>
          <Input id={`title-${dayId}`} name="title" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`type-${dayId}`}>유형</Label>
          <select
            id={`type-${dayId}`}
            name="type"
            defaultValue="기타"
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
            <Label htmlFor={`start-${dayId}`}>시작 시간</Label>
            <Input id={`start-${dayId}`} name="startTime" type="time" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`end-${dayId}`}>종료 시간</Label>
            <Input id={`end-${dayId}`} name="endTime" type="time" />
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`note-${dayId}`}>메모</Label>
          <Textarea id={`note-${dayId}`} name="note" rows={2} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`map-${dayId}`}>구글맵 링크</Label>
          <Input
            id={`map-${dayId}`}
            name="mapUrl"
            type="url"
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`photos-${dayId}`}>사진</Label>
          <Input id={`photos-${dayId}`} name="photos" type="file" accept="image/*" multiple />
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" disabled={pending}>
            적용
          </Button>
          <Button type="button" variant="outline" onClick={close}>
            취소
          </Button>
        </div>
      </form>
    </details>
  );
}
