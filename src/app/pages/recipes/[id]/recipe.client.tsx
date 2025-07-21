"use client";

import { generatedRecipeSchema } from "@/app/api/generate/recipe/schema";
import type { Recipe } from "@generated/prisma";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useEffect } from "react";
import { handleGeneratedRecipe } from "./functions";
import { IngredientOrStepList } from "./components/list";

export function RecipeClient({ recipe }: { recipe: Recipe }) {
  const { submit, object, error, isLoading } = useObject({
    api: "/api/generate/recipe",
    schema: generatedRecipeSchema,
    onFinish: (result) => {
      console.log("hit and finish");
      console.log(result);
      if (result.object) {
        handleGeneratedRecipe(recipe.id, result.object);
      }
    },
    onError: (error) => {
      console.log("hit and error");
      console.log(error);
    },
  });

  useEffect(() => {
    console.log(recipe);
    if (recipe.status === "PENDING" || recipe.status === "PROCESSING") {
      console.log("starting to generate recipe");
      submit({
        recipeId: recipe.id,
      });
    }
  }, []);

  return (
    <div className="space-y-4 mt-8">
      {error && <div>Error: {error.message}</div>}
      {object && (
        <div className="space-y-4">
          <IngredientOrStepList
            items={object.ingredients || []}
            title="Ingredients"
          />
          <IngredientOrStepList
            items={object.instructions || []}
            title="Steps"
          />
        </div>
      )}
    </div>
  );
}
