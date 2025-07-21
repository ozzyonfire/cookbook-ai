import { z } from "zod";

export const ingredientSubstituteSchema = z.object({
  substitutes: z.array(
    z.object({
      ingredient: z.string().describe("The substitute ingredient name."),
      reason: z
        .string()
        .describe("Brief explanation of why this is a good substitute."),
      ratio: z.string().describe("Substitution ratio (e.g., '1:1', '2:1')."),
    })
  ),
});

export type IngredientSubstitutes = z.infer<typeof ingredientSubstituteSchema>;

export type IngredientSubstitute = IngredientSubstitutes["substitutes"][number];
