"use client";

import { IngredientOrStepList } from "./list";
import { SimpleSuggestionBox } from "./simple-suggestion-box";
import { RecipeProvider, useRecipeContext } from "../context/recipe-context";
import { RecipeActions } from "./recipe-actions";
import type { RecipeForPage } from "../recipe.page";

function RecipeContent({ recipe }: { recipe: NonNullable<RecipeForPage> }) {
  return (
    <div className="space-y-4 mt-8">
      <IngredientOrStepList items={recipe.ingredients} title="Ingredients" />
      <IngredientOrStepList items={recipe.steps} title="Steps" />
      <SimpleSuggestionBox recipe={recipe} />
    </div>
  );
}

export function EditableRecipeView({ recipe }: { recipe: RecipeForPage }) {
  return (
    <RecipeProvider recipe={recipe}>
      <RecipeContent recipe={recipe} />
      <RecipeActions />
    </RecipeProvider>
  );
}
