import { z } from "zod";

export const recipeSuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      suggestion: z
        .string()
        .describe(
          "A concise, one-line suggestion for modifying the recipe (e.g., 'make it vegetarian', 'one-pot style', 'italian-inspired')"
        ),
      category: z
        .string()
        .describe(
          "The category of the suggestion (e.g., 'dietary', 'cooking method', 'cuisine style', 'difficulty')"
        ),
      description: z
        .string()
        .describe("A brief explanation of what this modification would entail"),
    })
  ),
});

export type RecipeSuggestions = z.infer<typeof recipeSuggestionsSchema>;

export type RecipeSuggestion = RecipeSuggestions["suggestions"][number];
