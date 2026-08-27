import { addInfoNote } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddInfoNoteForm({ personId }: { personId: string }) {
  const action = addInfoNote.bind(null, personId);

  return (
    <details className="rounded-md border border-dashed p-3">
      <summary className="cursor-pointer text-sm font-medium">정보 추가</summary>
      <form
        action={action}
        encType="multipart/form-data"
        className="mt-3 space-y-3"
      >
        <div className="space-y-1.5">
          <Label htmlFor={`note-title-${personId}`}>제목</Label>
          <Input
            id={`note-title-${personId}`}
            name="title"
            placeholder="예: 여권 사본, 항공권"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-text-${personId}`}>내용</Label>
          <Textarea id={`note-text-${personId}`} name="text" rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-link-${personId}`}>웹 링크</Label>
          <Input
            id={`note-link-${personId}`}
            name="link"
            type="url"
            placeholder="예: 항공권 예매 링크, 구글맵 링크"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-photos-${personId}`}>사진</Label>
          <Input
            id={`note-photos-${personId}`}
            name="photos"
            type="file"
            accept="image/*"
            multiple
          />
        </div>
        <Button type="submit">추가</Button>
      </form>
    </details>
  );
}
