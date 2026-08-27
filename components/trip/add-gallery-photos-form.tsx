import { addGalleryPhotos } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddGalleryPhotosForm({ dayId }: { dayId: string }) {
  const action = addGalleryPhotos.bind(null, dayId);

  return (
    <details className="rounded-md border border-dashed p-3">
      <summary className="cursor-pointer text-sm font-medium">사진 추가</summary>
      <form
        action={action}
        encType="multipart/form-data"
        className="mt-3 space-y-3"
      >
        <div className="space-y-1.5">
          <Label htmlFor={`gallery-photos-${dayId}`}>사진 올리기</Label>
          <Input
            id={`gallery-photos-${dayId}`}
            name="photos"
            type="file"
            accept="image/*"
            multiple
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`gallery-caption-${dayId}`}>설명(선택, 여러 장을 한번에 올리면 모두에 붙는다)</Label>
          <Input id={`gallery-caption-${dayId}`} name="caption" placeholder="예: 저녁 식사" />
        </div>
        <Button type="submit">올리기</Button>
      </form>
    </details>
  );
}
