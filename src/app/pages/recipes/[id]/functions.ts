"use server";

import type { GeneratedRecipe } from "@/app/api/generate/recipe/schema";
import type { RecipeTweak } from "@/app/api/generate/recipe-tweaks/schema";
import { db } from "@/db";
import { getRequestInfo } from "rwsdk/worker";

export async function handleSaveGeneratedRecipe(
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

export async function createRecipeFromTweak(
  originalRecipeId: string,
  tweak: RecipeTweak
) {
  const { ctx } = getRequestInfo();

  if (!ctx.user) {
    return { error: "You must be logged in to create a recipe" };
  }

  const originalRecipe = await db.recipe.findUnique({
    where: { id: originalRecipeId },
  });

  if (!originalRecipe) {
    return { error: "Original recipe not found" };
  }

  const recipe = await db.recipe.create({
    data: {
      tags: originalRecipe.tags,
      title: tweak.title,
      description: tweak.description,
      status: "PENDING",
      userId: ctx.user.id,
    },
  });

  return { success: recipe.id };
}

export async function handleSubstituteIngredient(
  recipeId: string,
  ingredientId: string,
  substitute: string
) {
  await db.ingredient.update({
    where: { id: ingredientId, recipeId },
    data: {
      name: substitute,
    },
  });
}

export async function handleRegenerateRecipe(recipeId: string) {
  try {
    await db.recipe.update({
      where: { id: recipeId },
      data: {
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Failed to regenerate recipe" };
  }
}
