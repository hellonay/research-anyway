"use client";

import { useRef } from "react";

import { addItem } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ITEM_TYPES } from "@/lib/trip/types";

export function AddItemForm({ dayId }: { dayId: string }) {
  const action = addItem.bind(null, dayId);
  const detailsRef = useRef<HTMLDetailsElement>(null);

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
        action={action}
        encType="multipart/form-data"
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
          <Button type="submit">적용</Button>
          <Button
            type="reset"
            variant="outline"
            onClick={() => {
              if (detailsRef.current) detailsRef.current.open = false;
            }}
          >
            취소
          </Button>
        </div>
      </form>
    </details>
  );
}
