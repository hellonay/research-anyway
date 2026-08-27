import { updateDay } from "@/app/actions";
import { InlineEditableLabel } from "@/components/trip/inline-editable-label";

export function DayLabel({ dayId, label }: { dayId: string; label: string }) {
  return (
    <InlineEditableLabel
      value={label}
      fieldName="label"
      action={updateDay.bind(null, dayId)}
    />
  );
}
