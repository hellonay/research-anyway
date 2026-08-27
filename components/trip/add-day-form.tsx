import { addDay } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddDayForm() {
  return (
    <form
      action={addDay}
      className="flex flex-wrap items-end gap-2 rounded-md border border-dashed p-3"
    >
      <div className="min-w-40 flex-1 space-y-1.5">
        <Label htmlFor="label">Day 라벨 (예: 2026-09-10 또는 목요일)</Label>
        <Input id="label" name="label" placeholder="날짜 또는 요일" required />
      </div>
      <Button type="submit" variant="secondary">
        Day 추가
      </Button>
    </form>
  );
}
