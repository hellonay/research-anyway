import { deleteDay, updateDay } from "@/app/actions";
import { InlineEditableLabel } from "@/components/trip/inline-editable-label";
import { Button } from "@/components/ui/button";

export function DayLabel({ dayId, label }: { dayId: string; label: string }) {
  return (
    <InlineEditableLabel
      value={label}
      fieldName="label"
      action={updateDay.bind(null, dayId)}
      extraActions={
        <form action={deleteDay.bind(null, dayId)}>
          <Button type="submit" size="sm" variant="destructive">
            Day 삭제
          </Button>
        </form>
      }
    />
  );
}
