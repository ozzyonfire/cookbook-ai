import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import type { RequestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { recipeTweaksSchema } from "./schema";
import { db } from "@/db";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const generateRecipeTweaksHandler = async ({ request }: RequestInfo) => {
  const body = (await request.json()) as {
    recipeId: string;
    userPrompt?: string;
    generateAuto?: boolean;
  };

  const recipe = await db.recipe.findUnique({
    where: {
      id: body.recipeId,
    },
    include: {
      ingredients: true,
      steps: true,
    },
  });

  if (!recipe) {
    return new Response(null, { status: 404 });
  }

  const recipeContext = {
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients.map((i) => i.name),
    steps: recipe.steps.map((s) => s.description),
    tags: recipe.tags,
  };

  let userMessage = "";

  if (body.generateAuto) {
    userMessage = `
    Generate 4 creative variations of this recipe. Consider different cooking methods, 
    ingredient substitutions, dietary modifications, and flavor profiles:
    ${JSON.stringify(recipeContext)}
    `;
  } else {
    userMessage = `
    Based on the user's request: "${body.userPrompt}"
    Generate 4 variations of this recipe:
    ${JSON.stringify(recipeContext)}
    
    Focus on the user's specific request while maintaining the essence of the original recipe.
    `;
  }

  const result = streamObject({
    model: openai("gpt-4.1-mini"),
    schema: recipeTweaksSchema,
    messages: [
      {
        role: "system",
        content: `
        You are a helpful assistant and an amazing and creative chef.
        You help users modify and improve existing recipes based on their preferences.
        Always provide practical, achievable variations that maintain the spirit of the original recipe.
        Focus on clear, actionable changes that home cooks can easily implement.
        `,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.8,
    onError: (error) => {
      console.log("hit and error");
      console.log(error);
    },
  });

  return result.toTextStreamResponse();
};

export default generateRecipeTweaksHandler;
