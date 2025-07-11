import type { LayoutProps } from "rwsdk/router";
import { AppProviders } from "./AppProviders";
import { db } from "@/db";

export async function getUserRecipes(userId?: string) {
  if (!userId) {
    return [];
  }

  const recipes = await db.recipe.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: 10, // Limit to 10 most recent recipes
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  return recipes;
}

export type SidebarRecipes = Awaited<ReturnType<typeof getUserRecipes>>;

export async function Layout({ children, requestInfo }: LayoutProps) {
  const ctx = requestInfo?.ctx;
  const savedRecipes = await getUserRecipes(ctx?.user?.id);

  return (
    <AppProviders
      theme={ctx?.theme ?? null}
      sidebar={ctx?.sidebar ?? null}
      savedRecipes={savedRecipes}
    >
      {children}
    </AppProviders>
  );
}
