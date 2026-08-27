import { Car, Compass, ShoppingBag, Sparkles, Tag, Utensils } from "lucide-react";
import { deleteItem, deleteItemPhoto } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemEditForm } from "@/components/trip/item-edit-form";
import { cn } from "@/lib/utils";
import { resolveMapEmbedSrc } from "@/lib/trip/map-embed";
import { type Item, type ItemType } from "@/lib/trip/types";

// 텍스트 배지는 "쇼핑"·"맛사지"가 전부 "기타"로 뭉뚱그려지는 등 제목과
// 따로 노는 느낌이 강해, 카테고리는 아이콘으로만 가볍게 표시하고
// 제목이 일정의 대표 내용 역할을 하도록 한다.
const ITEM_TYPE_ICONS: Record<ItemType, typeof Tag> = {
  이동: Car,
  식사: Utensils,
  여가: Compass,
  휴식: Sparkles,
  쇼핑: ShoppingBag,
  기타: Tag,
};

// 목록을 훑을 때 유형이 한눈에 구분되도록 카테고리마다 색을 다르게 준다.
// "기타"도 다른 카테고리처럼 채워진 배지로 통일하되, 특정 색이 없는
// 항목이라 슬레이트 톤으로 중립적으로 표시한다.
const ITEM_TYPE_COLORS: Record<ItemType, string> = {
  이동: "border-transparent bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  식사: "border-transparent bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  여가: "border-transparent bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  휴식: "border-transparent bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  쇼핑: "border-transparent bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",
  기타: "border-transparent bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
};

// 카테고리를 새로 정리하기 전(이동수단·식당·골프 등)에 저장된 데이터가 있을 수 있어
// 매핑에 없는 값이면 기타 아이콘으로 대체해 화면이 깨지지 않게 한다.
function iconForItemType(type: ItemType) {
  return ITEM_TYPE_ICONS[type] ?? Tag;
}

function colorForItemType(type: ItemType) {
  return ITEM_TYPE_COLORS[type] ?? "";
}

function timeRange(item: Item) {
  if (item.startTime && item.endTime) return `${item.startTime} ~ ${item.endTime}`;
  if (item.startTime) return item.startTime;
  return null;
}

export async function ItemCard({ dayId, item }: { dayId: string; item: Item }) {
  const range = timeRange(item);
  const TypeIcon = iconForItemType(item.type);
  const mapEmbedSrc = item.mapUrl ? await resolveMapEmbedSrc(item.mapUrl) : null;

  return (
    <li className="rounded-md border bg-card">
      {/* 접었다 펼 수 있는 항목: 접힌 상태에는 유형·시간·제목만 보인다 */}
      <details>
        <summary className="flex cursor-pointer items-center gap-2 p-3">
          <Badge
            variant="outline"
            aria-label={item.type}
            title={item.type}
            className={cn(colorForItemType(item.type))}
          >
            <TypeIcon />
          </Badge>
          {range && <span className="text-sm text-muted-foreground">{range}</span>}
          <span className="min-w-0 flex-1 truncate font-medium">{item.title}</span>
        </summary>

        <div className="space-y-3 border-t p-3">
          {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
          {item.mapUrl && (
            <div className="space-y-2">
              <a
                href={item.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline underline-offset-2"
              >
                지도에서 보기
              </a>
              {/* 좌표·장소명이 URL에 담긴 링크에서만 비공식 임베드로 미니맵을
                  보여준다. maps.app.goo.gl 같은 단축 링크는 뜨지 않는다. */}
              {mapEmbedSrc && (
                <iframe
                  src={mapEmbedSrc}
                  className="h-40 w-full rounded-md border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${item.title} 지도`}
                />
              )}
            </div>
          )}

          {item.photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt=""
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <form
                    action={deleteItemPhoto.bind(null, dayId, item.id, photo.id)}
                    className="absolute -right-1.5 -top-1.5"
                  >
                    <button
                      type="submit"
                      aria-label="사진 삭제"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[11px] leading-none text-background"
                    >
                      ×
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}

          <ItemEditForm dayId={dayId} item={item} />

          <form action={deleteItem.bind(null, dayId, item.id)}>
            <Button type="submit" variant="destructive">
              항목 삭제
            </Button>
          </form>
        </div>
      </details>
    </li>
  );
}
