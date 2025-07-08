"use server";

import { requestInfo } from "rwsdk/worker";
import type { Theme } from "../shared/theme";

export async function setThemeFn(theme: Theme) {
  const { headers } = requestInfo;
  headers.set(
    "Set-Cookie",
    `theme=${theme}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  return theme;
}
