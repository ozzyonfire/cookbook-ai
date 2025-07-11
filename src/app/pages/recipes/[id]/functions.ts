"use server";

import type { GeneratedRecipe } from "@/app/api/generate/recipe/schema";
import { db } from "@/db";

export async function handleGeneratedRecipe(
  recipeId: string,
  generatedRecipe: GeneratedRecipe
) {
  const recipe = await db.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  const ingredients = generatedRecipe.ingredients.map((ingredient) => {
    return {
      name: ingredient,
    };
  });

  const steps = generatedRecipe.instructions.map((instruction) => {
    return {
      description: instruction,
    };
  });

  await db.recipe.update({
    where: { id: recipeId },
    data: {
      ingredients: {
        create: ingredients,
      },
      steps: {
        create: steps,
      },
      status: "COMPLETED",
    },
  });
}
