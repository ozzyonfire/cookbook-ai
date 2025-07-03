"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, BookOpen, ChefHat, Sparkles } from "lucide-react";
import { useState } from "react";
import { link } from "@/app/shared/links";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    window.location.href = path;
    setIsOpen(false);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">
                Meal Bot
              </span>
              <div className="text-xs text-muted-foreground">
                What's for dinner?
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-normal">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => handleNavigation("/")}>
                    <div className="p-1.5 bg-accent rounded-lg">
                      <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
                    </div>
                    <span className="font-medium text-sidebar-foreground">
                      Create Recipe
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigation("/recipes")}
                  >
                    <div className="p-1.5 bg-secondary rounded-lg">
                      <BookOpen className="h-3.5 w-3.5 text-secondary-foreground" />
                    </div>
                    <span className="font-medium text-sidebar-foreground">
                      Saved Recipes
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-xs text-muted-foreground">
            Your personal cookbook powered by AI
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <ChefHat className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Cookbook</span>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 bg-background min-h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
