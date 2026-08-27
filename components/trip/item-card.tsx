import { Car, Compass, Ellipsis, ShoppingBag, Sparkles, Utensils } from "lucide-react";
import { deleteItem, deleteItemPhoto, updateItem } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ITEM_TYPES, type Item, type ItemType } from "@/lib/trip/types";

// 텍스트 배지는 "쇼핑"·"맛사지"가 전부 "기타"로 뭉뚱그려지는 등 제목과
// 따로 노는 느낌이 강해, 카테고리는 아이콘으로만 가볍게 표시하고
// 제목이 일정의 대표 내용 역할을 하도록 한다.
const ITEM_TYPE_ICONS: Record<ItemType, typeof Ellipsis> = {
  이동: Car,
  식사: Utensils,
  여가: Compass,
  휴식: Sparkles,
  쇼핑: ShoppingBag,
  기타: Ellipsis,
};

// 카테고리를 새로 정리하기 전(이동수단·식당·골프 등)에 저장된 데이터가 있을 수 있어
// 매핑에 없는 값이면 기타 아이콘으로 대체해 화면이 깨지지 않게 한다.
function iconForItemType(type: ItemType) {
  return ITEM_TYPE_ICONS[type] ?? Ellipsis;
}

function timeRange(item: Item) {
  if (item.startTime && item.endTime) return `${item.startTime} ~ ${item.endTime}`;
  if (item.startTime) return item.startTime;
  return null;
}

export function ItemCard({ dayId, item }: { dayId: string; item: Item }) {
  const range = timeRange(item);
  const updateAction = updateItem.bind(null, dayId, item.id);
  const TypeIcon = iconForItemType(item.type);

  return (
    <li className="rounded-md border bg-card">
      {/* 접었다 펼 수 있는 항목: 접힌 상태에는 유형·시간·제목만 보인다 */}
      <details>
        <summary className="flex cursor-pointer items-center gap-2 p-3">
          <Badge variant="outline" aria-label={item.type} title={item.type}>
            <TypeIcon />
          </Badge>
          {range && <span className="text-sm text-muted-foreground">{range}</span>}
          <span className="min-w-0 flex-1 truncate font-medium">{item.title}</span>
        </summary>

        <div className="space-y-3 border-t p-3">
          {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
          {item.mapUrl && (
            <a
              href={item.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline underline-offset-2"
            >
              지도에서 보기
            </a>
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

          <details>
            <summary className="cursor-pointer text-sm font-medium">수정</summary>
            <form
              action={updateAction}
              encType="multipart/form-data"
              className="mt-3 grid gap-3 sm:grid-cols-2"
            >
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`edit-title-${item.id}`}>제목</Label>
                <Input
                  id={`edit-title-${item.id}`}
                  name="title"
                  defaultValue={item.title}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`edit-type-${item.id}`}>유형</Label>
                <select
                  id={`edit-type-${item.id}`}
                  name="type"
                  defaultValue={item.type}
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
                  <Label htmlFor={`edit-start-${item.id}`}>시작 시간</Label>
                  <Input
                    id={`edit-start-${item.id}`}
                    name="startTime"
                    type="time"
                    defaultValue={item.startTime ?? ""}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`edit-end-${item.id}`}>종료 시간</Label>
                  <Input
                    id={`edit-end-${item.id}`}
                    name="endTime"
                    type="time"
                    defaultValue={item.endTime ?? ""}
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`edit-note-${item.id}`}>메모</Label>
                <Textarea
                  id={`edit-note-${item.id}`}
                  name="note"
                  rows={2}
                  defaultValue={item.note ?? ""}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`edit-map-${item.id}`}>구글맵 링크</Label>
                <Input
                  id={`edit-map-${item.id}`}
                  name="mapUrl"
                  type="url"
                  defaultValue={item.mapUrl ?? ""}
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`edit-photos-${item.id}`}>사진 추가</Label>
                <Input
                  id={`edit-photos-${item.id}`}
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">저장</Button>
              </div>
            </form>
          </details>

          <form action={deleteItem.bind(null, dayId, item.id)}>
            <Button type="submit" variant="ghost" size="sm">
              항목 삭제
            </Button>
          </form>
        </div>
      </details>
    </li>
  );
}
