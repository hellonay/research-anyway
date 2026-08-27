import { AddPersonForm } from "@/components/trip/add-person-form";
import { PageContainer } from "@/components/trip/page-container";
import { PersonSection } from "@/components/trip/person-section";
import { readTrip } from "@/lib/trip/store";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const trip = await readTrip();

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold tracking-tight">정보</h1>
      <AddPersonForm />
      {trip.people.length > 0 ? (
        <div className="space-y-4">
          {trip.people.map((person) => (
            <PersonSection key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">아직 등록된 사람이 없습니다.</p>
      )}
    </PageContainer>
  );
}
