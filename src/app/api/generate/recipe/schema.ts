import { z } from "zod";

export const generatedRecipeSchema = z.object({
  ingredients: z.array(z.string()).describe("The ingredients of the recipe."),
  instructions: z.array(z.string()).describe("The instructions of the recipe."),
});

export type GeneratedRecipe = z.infer<typeof generatedRecipeSchema>;
