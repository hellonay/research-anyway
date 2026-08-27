"use server";

import { redirect } from "next/navigation";

import { createSession, deleteSession, isCorrectPassword } from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

export async function login(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!isCorrectPassword(password)) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  await createSession();
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
