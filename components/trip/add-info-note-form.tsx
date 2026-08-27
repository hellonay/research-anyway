"use client";

import { useRef, useTransition } from "react";

import { addInfoNote } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 적용을 누르면 서버 액션을 직접 호출해 완료를 기다린 뒤 패널을 접고,
// 취소를 누르면 입력값만 비우고 패널을 접는다. 폼 제출을 브라우저에
// 맡기지 않고 여기서 처리하므로 action/encType 조합 대신 onSubmit을 쓴다.
export function AddInfoNoteForm({ personId }: { personId: string }) {
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
      await addInfoNote(personId, formData);
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
        className="mt-3 space-y-3 rounded-md border border-dashed p-3"
      >
        <div className="space-y-1.5">
          <Label htmlFor={`note-title-${personId}`}>제목</Label>
          <Input
            id={`note-title-${personId}`}
            name="title"
            placeholder="예: 여권 사본, 항공권"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-text-${personId}`}>내용</Label>
          <Textarea id={`note-text-${personId}`} name="text" rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-link-${personId}`}>웹 링크</Label>
          <Input
            id={`note-link-${personId}`}
            name="link"
            type="url"
            placeholder="예: 항공권 예매 링크, 구글맵 링크"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-photos-${personId}`}>사진</Label>
          <Input
            id={`note-photos-${personId}`}
            name="photos"
            type="file"
            accept="image/*"
            multiple
          />
        </div>
        <div className="flex gap-2">
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
