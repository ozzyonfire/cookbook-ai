"use client";

import { useRecipeContext } from "../context/recipe-context";
import { RecipeClient } from "../recipe.client";
import type { RecipeForPage } from "../recipe.page";
import { IngredientOrStepList } from "./list";
import { RecipeActions } from "./recipe-actions";
import { SimpleSuggestionBox } from "./simple-suggestion-box";

function RecipeContent({ recipe }: { recipe: RecipeForPage }) {
  return (
    <div className="space-y-4 mt-8">
      <IngredientOrStepList
        items={recipe.ingredients}
        title="Ingredients"
        recipe={recipe}
      />
      <IngredientOrStepList
        items={recipe.steps}
        title="Steps"
        recipe={recipe}
      />
      <SimpleSuggestionBox recipe={recipe} />
    </div>
  );
}

export function EditableRecipeView({ recipe }: { recipe: RecipeForPage }) {
  const { isGenerating } = useRecipeContext();
  if (isGenerating) {
    return <RecipeClient />;
  }

  return (
    <>
      <RecipeContent recipe={recipe} />
      <RecipeActions />
    </>
  );
}
