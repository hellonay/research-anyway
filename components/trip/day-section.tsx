import { ChevronDown } from "lucide-react";
import { deleteDay } from "@/app/actions";
import { AddItemForm } from "@/components/trip/add-item-form";
import { ItemCard } from "@/components/trip/item-card";
import { Button } from "@/components/ui/button";
import { sortItems } from "@/lib/trip/sort";
import type { Day } from "@/lib/trip/types";

// Day가 늘어나도 순환하도록 파스텔 톤 5가지를 돌려쓴다. 헤더 hover는 각 톤에 맞춰 한 단계 진하게 잡았다.
const DAY_PANEL_COLORS = [
  "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40 [&_summary:hover]:bg-sky-100 dark:[&_summary:hover]:bg-sky-900/40",
  "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 [&_summary:hover]:bg-amber-100 dark:[&_summary:hover]:bg-amber-900/40",
  "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 [&_summary:hover]:bg-emerald-100 dark:[&_summary:hover]:bg-emerald-900/40",
  "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40 [&_summary:hover]:bg-violet-100 dark:[&_summary:hover]:bg-violet-900/40",
  "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 [&_summary:hover]:bg-rose-100 dark:[&_summary:hover]:bg-rose-900/40",
];

export function DaySection({ day, index }: { day: Day; index: number }) {
  const items = sortItems(day.items);
  const colors = DAY_PANEL_COLORS[index % DAY_PANEL_COLORS.length];

  return (
    <section className={`rounded-lg border ${colors}`}>
      {/* Day 전체를 접었다 펼 수 있다. 기본은 펼친 상태다 */}
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4">
          <span className="flex items-center gap-2">
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
            <h2 className="text-lg font-semibold">{day.label}</h2>
          </span>
          <span className="text-sm text-muted-foreground">{items.length}개 일정</span>
        </summary>

        <div className="space-y-3 border-t p-4">
          <form action={deleteDay.bind(null, day.id)}>
            <Button type="submit" variant="ghost" size="sm">
              Day 삭제
            </Button>
          </form>

          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item) => (
                <ItemCard key={item.id} dayId={day.id} item={item} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">아직 등록된 일정이 없습니다.</p>
          )}

          <AddItemForm dayId={day.id} />
        </div>
      </details>
    </section>
  );
}
