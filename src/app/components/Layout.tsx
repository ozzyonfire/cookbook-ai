import type { LayoutProps } from "rwsdk/router";
import { AppProviders } from "./AppProviders";

export function Layout({ children, requestInfo }: LayoutProps) {
  const ctx = requestInfo?.ctx;

  return (
    <AppProviders theme={ctx?.theme ?? null} sidebar={ctx?.sidebar ?? null}>
      {children}
    </AppProviders>
  );
}
