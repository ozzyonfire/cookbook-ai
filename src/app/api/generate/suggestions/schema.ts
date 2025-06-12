import { z } from "zod";

export const mealSuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string().describe("The title of the meal suggestion."),
      description: z.string().describe("A short description of the meal."),
      tags: z.array(z.string()).describe("The tags of the meal suggestion."),
    })
  ),
});

export type MealSuggestions = z.infer<typeof mealSuggestionsSchema>;
