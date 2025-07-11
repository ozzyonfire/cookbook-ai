"use client";
import { BookOpen, ChefHat, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { link } from "../shared/links";
import { Link } from "./Link";
import type { SidebarRecipes } from "./Layout";

// Main navigation items
const navItems = [
  {
    title: "Create Recipe",
    url: "/" as const,
    icon: Sparkles,
  },
  {
    title: "All Recipes",
    url: "/recipes" as const,
    icon: BookOpen,
  },
];

export function AppSidebar({ savedRecipes }: { savedRecipes: SidebarRecipes }) {
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg text-foreground">Meal Bot</span>
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
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg">
                        <item.icon className="h-3.5 w-3.5 text-accent-foreground" />
                      </div>
                      <span className="font-medium text-sidebar-foreground">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-normal">
            Recent Recipes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {savedRecipes.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <div className="p-1.5 bg-muted rounded-lg">
                      <ChefHat className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">
                      No recipes yet
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                savedRecipes.slice(0, 5).map((recipe) => (
                  <SidebarMenuItem key={recipe.id}>
                    <SidebarMenuButton asChild>
                      <a href={link("/recipes/:id", { id: recipe.id })}>
                        <div className="p-1.5 bg-secondary rounded-lg">
                          <ChefHat className="h-3.5 w-3.5 text-secondary-foreground" />
                        </div>
                        <span className="font-medium text-sidebar-foreground truncate">
                          {recipe.title || "Untitled Recipe"}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
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
  );
}
