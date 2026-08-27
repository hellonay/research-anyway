import { addInfoNote } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddInfoNoteForm() {
  return (
    <details className="rounded-md border border-dashed p-3">
      <summary className="cursor-pointer text-sm font-medium">정보 추가</summary>
      <form
        action={addInfoNote}
        encType="multipart/form-data"
        className="mt-3 space-y-3"
      >
        <div className="space-y-1.5">
          <Label htmlFor="note-title">제목</Label>
          <Input id="note-title" name="title" placeholder="예: 환전 팁, 짐 챙길 목록" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note-text">내용</Label>
          <Textarea id="note-text" name="text" rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note-photos">사진</Label>
          <Input id="note-photos" name="photos" type="file" accept="image/*" multiple />
        </div>
        <Button type="submit">추가</Button>
      </form>
    </details>
  );
}
