"use client";

import { useTransition, useState, type SyntheticEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 이름이 summary(패널 접힘/펼침 트리거) 안에 있으므로, 수정 버튼 클릭이 패널
// 토글로 번지지 않도록 항상 이벤트를 막는다.
function stop(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

// 사람 이름, Day 이름처럼 패널 헤더에서 바로 고칠 수 있는 짧은 텍스트에 쓰는
// 공용 인라인 수정 UI. action은 personId/dayId 등으로 미리 bind해 둔 서버
// 액션을 받는다.
export function InlineEditableLabel({
  value,
  fieldName,
  action,
  labelClassName = "text-lg font-semibold",
}: {
  value: string;
  fieldName: string;
  action: (formData: FormData) => Promise<void>;
  labelClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [pending, startTransition] = useTransition();

  function save() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const formData = new FormData();
    formData.set(fieldName, trimmed);
    startTransition(async () => {
      await action(formData);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <span
        className="flex items-center gap-2"
        onClick={stop}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            save();
          }
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoFocus
          className="h-8 w-36"
        />
        <Button type="button" size="sm" disabled={pending} onClick={save}>
          저장
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setDraft(value);
            setEditing(false);
          }}
        >
          취소
        </Button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className={labelClassName}>{value}</span>
      <button
        type="button"
        onClick={(event) => {
          stop(event);
          setEditing(true);
        }}
        className="text-xs text-muted-foreground underline underline-offset-2"
      >
        수정
      </button>
    </span>
  );
}
