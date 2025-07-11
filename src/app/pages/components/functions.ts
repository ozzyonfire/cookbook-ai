"use server";

import type { MealSuggestion } from "@/app/api/generate/suggestions/schema";
import { db } from "@/db";
import { getRequestInfo } from "rwsdk/worker";

export async function handleNewRecipe(
  _initialState: unknown,
  formData: FormData
) {
  const { ctx } = getRequestInfo();

  const selectedTags = formData.get("selectedTags") as string;

  if (!selectedTags) {
    return { error: "Tags are required" };
  }

  if (!ctx.user) {
    return { error: "You must be logged in to generate a recipe" };
  }

  const recipe = await db.recipe.create({
    data: {
      tags: selectedTags,
      status: "PENDING",
      userId: ctx.user.id,
    },
  });

  console.log(recipe);

  return { success: recipe.id };
}

export async function createRecipeFromSuggestion(
  selectedTags: string[],
  suggestion: MealSuggestion
) {
  const { ctx } = getRequestInfo();

  if (!ctx.user) {
    return { error: "You must be logged in to generate a recipe" };
  }

  const recipe = await db.recipe.create({
    data: {
      tags: selectedTags.join(","),
      title: suggestion.title,
      description: suggestion.description,
      status: "PENDING",
      userId: ctx.user.id,
    },
  });

  return { success: recipe.id };
}
