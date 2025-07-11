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
      time: z
        .string()
        .describe(
          "The time it takes to prepare the meal (eg. 10 minutes, 30 minutes, 1 hour, etc.)."
        ),
    })
  ),
});

export type MealSuggestions = z.infer<typeof mealSuggestionsSchema>;

export type MealSuggestion = MealSuggestions["suggestions"][number];
