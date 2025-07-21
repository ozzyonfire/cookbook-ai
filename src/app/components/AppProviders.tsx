"use client";

import { ThemeToggle } from "@/app/components/ThemeToggle";
import { ThemeProvider } from "@/app/context/ThemeProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";
import type { Theme } from "../shared/theme";
import { AppSidebar } from "./AppSidebar";
import type { SidebarRecipes } from "./Layout";
import { Link } from "./Link";

export function AppProviders(props: {
  children: React.ReactNode;
  theme: Theme | null;
  sidebar: boolean | null;
  savedRecipes: SidebarRecipes;
}) {
  const { children, sidebar, theme, savedRecipes } = props;

  return (
    <ThemeProvider defaultTheme={theme ?? "light"}>
      <SidebarProvider defaultOpen={sidebar ?? true}>
        <AppSidebar savedRecipes={savedRecipes} />
        <SidebarInset>
          <div className="flex gap-1 items-center p-1">
            <SidebarTrigger className="text-foreground" />
            <ThemeToggle />
            <div className="grow" />
            <Link href="/">
              <div
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">New Recipe</span>
              </div>
            </Link>
          </div>
          <div className="p-6 pt-0 relative">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
