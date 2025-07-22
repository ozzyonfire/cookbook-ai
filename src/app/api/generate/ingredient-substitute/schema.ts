import { z } from "zod";

export const ingredientSubstituteSchema = z.object({
  substitutes: z.array(
    z.object({
      ingredient: z
        .string()
        .describe("The substitute ingredient name with amount."),
      reason: z
        .string()
        .describe("Brief explanation of why this is a good substitute."),
    })
  ),
});

export type IngredientSubstitutes = z.infer<typeof ingredientSubstituteSchema>;

export type IngredientSubstitute = IngredientSubstitutes["substitutes"][number];
