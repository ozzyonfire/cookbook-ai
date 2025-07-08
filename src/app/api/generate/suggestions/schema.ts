import { z } from "zod";

export const mealSuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string().describe("The title of the meal suggestion."),
      description: z.string().describe("A short description of the meal."),
      ingredients: z
        .array(z.string())
        .describe("The high level ingredients of the meal suggestion."),
      difficulty: z
        .enum(["easy", "medium", "hard"])
        .describe("The difficulty of the meal suggestion."),
      time: z.number().describe("The time to prepare the meal in minutes."),
    })
  ),
});

export type MealSuggestions = z.infer<typeof mealSuggestionsSchema>;

export type MealSuggestion = MealSuggestions["suggestions"][number];
