import { updatePerson } from "@/app/actions";
import { InlineEditableLabel } from "@/components/trip/inline-editable-label";

export function PersonName({ personId, name }: { personId: string; name: string }) {
  return (
    <InlineEditableLabel
      value={name}
      fieldName="name"
      action={updatePerson.bind(null, personId)}
    />
  );
}
