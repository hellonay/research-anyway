import { addPerson } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddPersonForm() {
  return (
    <details className="rounded-md border border-dashed p-3">
      <summary className="cursor-pointer text-sm font-medium">사람 추가</summary>
      <form action={addPerson} className="mt-3 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="person-name">이름</Label>
          <Input id="person-name" name="name" placeholder="예: 홍길동" required />
        </div>
        <Button type="submit">추가</Button>
      </form>
    </details>
  );
}
