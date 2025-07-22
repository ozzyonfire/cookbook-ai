import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import type { RequestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { ingredientSubstituteSchema } from "./schema";
import type { Ingredient, Recipe } from "@generated/prisma";
import type { RecipeForPage } from "@/app/pages/recipes/[id]/recipe.page";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const generateIngredientSubstituteHandler = async ({
  request,
}: RequestInfo) => {
  const body = (await request.json()) as {
    ingredient: Ingredient;
    recipe: RecipeForPage;
  };

  console.log("body", body);

  const result = streamObject({
    model: openai("gpt-4.1-mini"),
    schema: ingredientSubstituteSchema,
    messages: [
      {
        role: "system",
        content: `
        You are a helpful culinary assistant. When given an ingredient, provide 3-4 suitable substitutes.
        Consider flavor profile, cooking properties, and availability.
        Always provide practical substitution ratios and brief explanations.
        `,
      },
      {
        role: "user",
        content: `
        Recipe: ${body.recipe.title}

        The full ingredient list is:
        ${body.recipe.ingredients.map((i) => i.name).join(", ")}

        Find substitutes for: "${body.ingredient.name}"
        
        Provide 3-4 good substitutes with ratios and reasons.
        `,
      },
    ],
    temperature: 0.7,
    onError: (error) => {
      console.log("Ingredient substitute error:", error);
    },
  });

  return result.toTextStreamResponse();
};

export default generateIngredientSubstituteHandler;
