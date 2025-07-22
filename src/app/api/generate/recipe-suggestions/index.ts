import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import type { RequestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { recipeSuggestionsSchema } from "./schema";
import { db } from "@/db";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const generateRecipeSuggestionsHandler = async ({ request }: RequestInfo) => {
  const body = (await request.json()) as {
    recipeId: string;
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

  const result = streamObject({
    model: openai("gpt-4.1-mini"),
    schema: recipeSuggestionsSchema,
    messages: [
      {
        role: "system",
        content: `
        You are a helpful assistant and an amazing and creative chef.
        Generate concise, one-line suggestions for modifying recipes.
        Focus on practical, achievable modifications that home cooks can easily understand and implement.
        
        Categories of suggestions to consider:
        - Dietary modifications (vegetarian, vegan, gluten-free, low-carb, etc.)
        - Cooking methods (one-pot, air fryer, slow cooker, grilled, etc.)
        - Cuisine styles (italian-style, mexican-inspired, asian-fusion, etc.)
        - Difficulty adjustments (simplified version, gourmet upgrade, etc.)
        - Health modifications (lighter version, protein-packed, etc.)
        - Seasonal adaptations (summer version, winter comfort, etc.)
        
        Keep suggestions short (5 words or less), actionable, and inspiring.
        `,
      },
      {
        role: "user",
        content: `
        Generate 3-4 one-line suggestions for modifying this recipe:
        ${JSON.stringify(recipeContext)}
        
        Provide diverse suggestions across different categories to give the user various options for customizing their recipe.
        `,
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

export default generateRecipeSuggestionsHandler;
