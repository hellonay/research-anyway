import { addGalleryPhotos } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddGalleryPhotosForm() {
  return (
    <form
      action={addGalleryPhotos}
      encType="multipart/form-data"
      className="space-y-3 rounded-md border border-dashed p-3"
    >
      <div className="space-y-1.5">
        <Label htmlFor="gallery-photos">사진 올리기</Label>
        <Input id="gallery-photos" name="photos" type="file" accept="image/*" multiple required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="gallery-caption">설명(선택, 여러 장을 한번에 올리면 모두에 붙는다)</Label>
        <Input id="gallery-caption" name="caption" placeholder="예: 둘째 날 저녁" />
      </div>
      <Button type="submit">올리기</Button>
    </form>
  );
}
