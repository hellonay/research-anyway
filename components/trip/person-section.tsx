import { deletePerson, updatePerson } from "@/app/actions";
import { AddInfoNoteForm } from "@/components/trip/add-info-note-form";
import { InfoNoteCard } from "@/components/trip/info-note-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Person } from "@/lib/trip/types";

export function PersonSection({ person }: { person: Person }) {
  const updateAction = updatePerson.bind(null, person.id);

  return (
    <details className="rounded-lg border">
      <summary className="cursor-pointer p-4">
        <span className="text-lg font-semibold">{person.name}</span>
        {person.infoNotes.length > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            정보 {person.infoNotes.length}건
          </span>
        )}
      </summary>

      <div className="space-y-3 border-t p-4">
        <details>
          <summary className="cursor-pointer text-sm font-medium">이름 수정</summary>
          <form action={updateAction} className="mt-3 flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor={`person-name-${person.id}`}>이름</Label>
              <Input
                id={`person-name-${person.id}`}
                name="name"
                defaultValue={person.name}
                required
              />
            </div>
            <Button type="submit">저장</Button>
          </form>
        </details>

        <AddInfoNoteForm personId={person.id} />

        {person.infoNotes.length > 0 ? (
          <ul className="space-y-3">
            {person.infoNotes.map((note) => (
              <InfoNoteCard key={note.id} personId={person.id} note={note} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">아직 등록된 정보가 없습니다.</p>
        )}

        <form action={deletePerson.bind(null, person.id)}>
          <Button type="submit" variant="ghost" size="sm">
            사람 삭제
          </Button>
        </form>
      </div>
    </details>
  );
}
