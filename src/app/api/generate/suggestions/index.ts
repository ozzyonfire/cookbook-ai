import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import type { RequestInfo } from "rwsdk/worker";
import { mealSuggestionsSchema } from "./schema";
import { env } from "cloudflare:workers";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const generateSuggestionsHandler = async ({ request }: RequestInfo) => {
  const body = (await request.json()) as { prompt: string; tags: string[] };

  const result = streamObject({
    model: openai("gpt-4.1-mini"),
    schema: mealSuggestionsSchema,
    messages: [
      {
        role: "system",
        content: `
        You are a helpful assistant and an amazing and creative chef.
        You are given a prompt and you need to generate 3 meal suggestions.
        You are just the first step in the process. The user will choose one of the suggestions and you will generate the recipe.
        `,
      },
      {
        role: "user",
        content: `
        Generate 3 meal suggestions for the following prompt and user selected tags:
        ${body.prompt}
        ${body.tags.map((tag) => `- ${tag}`).join("\n")}
        `,
      },
    ],
    temperature: 0.7,
    onError: (error) => {
      console.log("hit and error");
      console.log(error);
    },
  });

  return result.toTextStreamResponse();
};

export default generateSuggestionsHandler;
