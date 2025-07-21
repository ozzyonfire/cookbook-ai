import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import type { RequestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { ingredientSubstituteSchema } from "./schema";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const generateIngredientSubstituteHandler = async ({
  request,
}: RequestInfo) => {
  const body = (await request.json()) as {
    ingredient: string;
    recipeContext?: string;
  };

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
        Find substitutes for: "${body.ingredient}"
        ${body.recipeContext ? `Recipe context: ${body.recipeContext}` : ""}
        
        Provide 3-4 good substitutes with ratios and reasons.
        `,
      },
    ],
    temperature: 0.5,
    onError: (error) => {
      console.log("Ingredient substitute error:", error);
    },
  });

  return result.toTextStreamResponse();
};

export default generateIngredientSubstituteHandler;
