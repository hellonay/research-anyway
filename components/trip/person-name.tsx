"use client";

import { useTransition, useState, type SyntheticEvent } from "react";

import { updatePerson } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 이름이 summary(패널 접힘/펼침 트리거) 안에 있으므로, 수정 버튼 클릭이 패널
// 토글로 번지지 않도록 항상 이벤트를 막는다.
function stop(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function PersonName({ personId, name }: { personId: string; name: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [pending, startTransition] = useTransition();

  function save() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const formData = new FormData();
    formData.set("name", trimmed);
    startTransition(async () => {
      await updatePerson(personId, formData);
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
          value={value}
          onChange={(event) => setValue(event.target.value)}
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
            setValue(name);
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
      <span className="text-lg font-semibold">{name}</span>
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
