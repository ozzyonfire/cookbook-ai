"use client";

import { StreamingList } from "./components/list";
import { useRecipeContext } from "./context/recipe-context";

export function RecipeClient() {
  const { error, generatedRecipe: object } = useRecipeContext();

  return (
    <div className="space-y-4 mt-8">
      {error && <div>Error: {error.message}</div>}
      {object && (
        <div className="space-y-4">
          <StreamingList items={object.ingredients || []} title="Ingredients" />
          <StreamingList items={object.instructions || []} title="Steps" />
        </div>
      )}
    </div>
  );
}
