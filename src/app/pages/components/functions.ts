"use server";

import type { MealSuggestion } from "@/app/api/generate/suggestions/schema";
import { db } from "@/db";
import { getRequestInfo } from "rwsdk/worker";

export async function handleNewRecipe(
  _initialState: unknown,
  formData: FormData
) {
  const { ctx } = getRequestInfo();

  const prompt = formData.get("prompt") as string;

  if (!prompt) {
    return { error: "Prompt is required" };
  }

  if (!ctx.user) {
    return { error: "You must be logged in to generate a recipe" };
  }

  const recipe = await db.recipe.create({
    data: {
      prompt,
      status: "PENDING",
      userId: ctx.user.id,
    },
  });

  console.log(recipe);

  return { success: recipe.id };
}

export async function createRecipeFromSuggestion(
  prompt: string,
  suggestion: MealSuggestion
) {
  const { ctx } = getRequestInfo();

  if (!ctx.user) {
    return { error: "You must be logged in to generate a recipe" };
  }

  const recipe = await db.recipe.create({
    data: {
      prompt,
      status: "PENDING",
      userId: ctx.user.id,
    },
  });
}
