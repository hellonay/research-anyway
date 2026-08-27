import { AddInfoNoteForm } from "@/components/trip/add-info-note-form";
import { InfoNoteCard } from "@/components/trip/info-note-card";
import { PageContainer } from "@/components/trip/page-container";
import { readTrip } from "@/lib/trip/store";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const trip = await readTrip();

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold tracking-tight">정보</h1>
      <AddInfoNoteForm />
      {trip.infoNotes.length > 0 ? (
        <ul className="space-y-3">
          {trip.infoNotes.map((note) => (
            <InfoNoteCard key={note.id} note={note} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">아직 등록된 정보가 없습니다.</p>
      )}
    </PageContainer>
  );
}
