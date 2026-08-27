"use client";

import { useActionState } from "react";

import { login, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>비밀번호 입력</CardTitle>
          <CardDescription>
            공유받은 비밀번호를 입력하면 여행 일정을 볼 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoFocus
                required
              />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "확인 중..." : "입장하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
