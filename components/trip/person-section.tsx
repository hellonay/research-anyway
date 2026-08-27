import { deletePerson } from "@/app/actions";
import { AddInfoNoteForm } from "@/components/trip/add-info-note-form";
import { InfoNoteCard } from "@/components/trip/info-note-card";
import { PersonName } from "@/components/trip/person-name";
import { Button } from "@/components/ui/button";
import { panelColor } from "@/lib/trip/panel-colors";
import type { Person } from "@/lib/trip/types";

export function PersonSection({ person, index }: { person: Person; index: number }) {
  const colors = panelColor(index);

  return (
    <details className={`rounded-lg border ${colors}`}>
      <summary className="flex cursor-pointer items-center justify-between p-4">
        <PersonName personId={person.id} name={person.name} />
        {person.infoNotes.length > 0 && (
          <span className="text-sm text-muted-foreground">
            정보 {person.infoNotes.length}건
          </span>
        )}
      </summary>

      <div className="space-y-3 border-t p-4">
        {person.infoNotes.length > 0 ? (
          <ul className="space-y-3">
            {person.infoNotes.map((note) => (
              <InfoNoteCard key={note.id} personId={person.id} note={note} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">아직 등록된 정보가 없습니다.</p>
        )}

        <AddInfoNoteForm personId={person.id} />

        <form action={deletePerson.bind(null, person.id)}>
          <Button type="submit" variant="ghost" size="sm">
            사람 삭제
          </Button>
        </form>
      </div>
    </details>
  );
}
