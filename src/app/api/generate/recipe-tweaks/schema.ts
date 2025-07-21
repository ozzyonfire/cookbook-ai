import { z } from "zod";

export const recipeTweaksSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string().describe("The title of the recipe variation."),
      description: z.string().describe("A short description of the variation."),
      changes: z
        .array(z.string())
        .describe("The specific changes made to the original recipe."),
      difficulty: z
        .enum(["easy", "medium", "hard"])
        .describe("The difficulty of the recipe variation."),
      time: z
        .string()
        .describe(
          "The time it takes to prepare the variation (eg. 10 minutes, 30 minutes, 1 hour, etc.)."
        ),
    })
  ),
});

export type RecipeTweaks = z.infer<typeof recipeTweaksSchema>;

export type RecipeTweak = RecipeTweaks["suggestions"][number];
