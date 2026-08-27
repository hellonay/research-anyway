import { ChevronDown } from "lucide-react";
import { AddItemForm } from "@/components/trip/add-item-form";
import { DayLabel } from "@/components/trip/day-label";
import { ItemCard } from "@/components/trip/item-card";
import { panelColor } from "@/lib/trip/panel-colors";
import { sortItems } from "@/lib/trip/sort";
import type { Day } from "@/lib/trip/types";

export function DaySection({ day, index }: { day: Day; index: number }) {
  const items = sortItems(day.items);
  const colors = panelColor(index);

  return (
    <section className={`rounded-lg border ${colors}`}>
      {/* Day 전체를 접었다 펼 수 있다. 기본은 펼친 상태다 */}
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4">
          <span className="flex items-center gap-2">
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
            <DayLabel dayId={day.id} label={day.label} />
          </span>
          <span className="text-sm text-muted-foreground">{items.length}개 일정</span>
        </summary>

        <div className="space-y-3 border-t p-4">
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
