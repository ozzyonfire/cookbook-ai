"use client";

import { RecipeProvider as RecipeProviderComponent } from "../context/recipe-context";
import type { RecipeForPage } from "../recipe.page";

export function RecipeProvider({
  children,
  recipe,
}: {
  children: React.ReactNode;
  recipe: RecipeForPage;
}) {
  return (
    <RecipeProviderComponent recipe={recipe}>
      {children}
    </RecipeProviderComponent>
  );
}
