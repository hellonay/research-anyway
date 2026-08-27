import { deleteInfoNote, deleteInfoNotePhoto, updateInfoNote } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <li className="space-y-3 rounded-md border p-3">
      {note.title && <p className="font-medium">{note.title}</p>}
      {note.text && (
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note.text}</p>
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

      {note.photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {note.photos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.url}
                alt=""
                className="h-16 w-16 rounded-md object-cover"
              />
              <form
                action={deleteInfoNotePhoto.bind(null, personId, note.id, photo.id)}
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
    </li>
  );
}
