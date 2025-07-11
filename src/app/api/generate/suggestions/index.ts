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
        You are just the first step in the process. The user will choose one of your suggestions.
        `,
      },
      {
        role: "user",
        content: `
        Generate 4 meal suggestions for the following user-selected tags:
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
