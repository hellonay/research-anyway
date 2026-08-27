"use client";

import { useRef, useTransition } from "react";

import { addPerson } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 추가를 누르면 서버 액션을 직접 호출해 완료를 기다린 뒤 입력값을 비우고
// 패널을 접는다. 폼 제출을 브라우저에 맡기지 않고 여기서 처리한다.
export function AddPersonForm() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      await addPerson(formData);
      formRef.current?.reset();
      if (detailsRef.current) detailsRef.current.open = false;
    });
  }

  return (
    <details ref={detailsRef} className="rounded-md border border-dashed p-3">
      <summary className="cursor-pointer text-sm font-medium">사람 추가</summary>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="person-name">이름</Label>
          <Input id="person-name" name="name" placeholder="예: 홍길동" required />
        </div>
        <Button type="submit" disabled={pending}>
          추가
        </Button>
      </form>
    </details>
  );
}
