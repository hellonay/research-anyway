import { deleteInfoNote, updateInfoNote } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoGallery } from "@/components/trip/photo-gallery";
import { Textarea } from "@/components/ui/textarea";
import type { InfoNote } from "@/lib/trip/types";

export function InfoNoteCard({
  personId,
  note,
}: {
  personId: string;
  note: InfoNote;
}) {
  const updateAction = updateInfoNote.bind(null, personId, note.id);

  return (
    <li>
      <details className="rounded-md border p-3">
        <summary className="cursor-pointer font-medium">
          {note.title ?? "제목 없음"}
        </summary>

        <div className="mt-3 space-y-3">
          {note.text && (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {note.text}
            </p>
          )}
          {note.link && (
            <a
              href={note.link}
              target="_blank"
              rel="noreferrer"
              className="block break-all text-sm text-primary underline underline-offset-2"
            >
              {note.link}
            </a>
          )}

          <PhotoGallery personId={personId} noteId={note.id} photos={note.photos} />

          <details>
            <summary className="cursor-pointer text-sm font-medium">수정</summary>
            <form
              action={updateAction}
              encType="multipart/form-data"
              className="mt-3 space-y-3"
            >
              <div className="space-y-1.5">
                <Label htmlFor={`note-edit-title-${note.id}`}>제목</Label>
                <Input
                  id={`note-edit-title-${note.id}`}
                  name="title"
                  defaultValue={note.title ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`note-edit-text-${note.id}`}>내용</Label>
                <Textarea
                  id={`note-edit-text-${note.id}`}
                  name="text"
                  rows={3}
                  defaultValue={note.text ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`note-edit-link-${note.id}`}>웹 링크</Label>
                <Input
                  id={`note-edit-link-${note.id}`}
                  name="link"
                  type="url"
                  defaultValue={note.link ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`note-edit-photos-${note.id}`}>사진 추가</Label>
                <Input
                  id={`note-edit-photos-${note.id}`}
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
              <Button type="submit">저장</Button>
            </form>
          </details>

          <form action={deleteInfoNote.bind(null, personId, note.id)}>
            <Button type="submit" variant="ghost" size="sm">
              삭제
            </Button>
          </form>
        </div>
      </details>
    </li>
  );
}
