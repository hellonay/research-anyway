import type { Item } from "./types";

// 시작 시간 순으로 정렬하고, 시작 시간이 없는 항목은 입력 순서를 유지한 채 맨 뒤로 보낸다.
export function sortItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime && !b.startTime) return -1;
    if (!a.startTime && b.startTime) return 1;
    return 0;
  });
}
