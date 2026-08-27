import { deleteDay } from "@/app/actions";
import { AddItemForm } from "@/components/trip/add-item-form";
import { ItemCard } from "@/components/trip/item-card";
import { Button } from "@/components/ui/button";
import { sortItems } from "@/lib/trip/sort";
import type { Day } from "@/lib/trip/types";

export function DaySection({ day }: { day: Day }) {
  const items = sortItems(day.items);

  return (
    <section className="rounded-lg border">
      {/* Day 전체를 접었다 펼 수 있다. 기본은 펼친 상태다 */}
      <details open>
        <summary className="flex cursor-pointer items-center justify-between gap-2 p-4">
          <h2 className="text-lg font-semibold">{day.label}</h2>
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
