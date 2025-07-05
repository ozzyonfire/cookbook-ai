"use server";

import { requestInfo } from "rwsdk/worker";

export async function setThemeFn(theme: "light" | "dark") {
  const { headers } = requestInfo;
  headers.set(
    "Set-Cookie",
    `theme=${theme}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  return theme;
}
