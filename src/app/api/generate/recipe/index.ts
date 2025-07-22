import { db } from "@/db";
import { createOpenAI } from "@ai-sdk/openai";
import { streamObject, type CoreMessage } from "ai";
import { env } from "cloudflare:workers";
import type { RequestInfo } from "rwsdk/worker";
import { generatedRecipeSchema } from "./schema";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const generateRecipeHandler = async ({ request }: RequestInfo) => {
  const body = (await request.json()) as {
    recipeId: string;
    modification?: string;
  };

  const recipe = await db.recipe.findFirst({
    where: {
      id: body.recipeId,
    },
  });

  if (!recipe) {
    return new Response(null, { status: 404 });
  }

  // set the status to processing
  await db.recipe.update({
    where: {
      id: body.recipeId,
    },
    data: { status: "PROCESSING" },
  });

  const messages: CoreMessage[] = [
    {
      role: "system",
      content: `
      You are a helpful assistant and an amazing and creative chef.
      Given a recipe suggestion you will provide the ingredients and instructions to make the recipe.
      `,
    },
    {
      role: "user",
      content: `
      Generate the ingredients and instructions to make the following recipe:
      ${JSON.stringify(recipe)}
      `,
    },
  ];

  if (body.modification) {
    messages.push({
      role: "user",
      content: `
      The user has requested the following modification to the recipe:
      ${body.modification}
      Please modify the recipe to include the user's request.
      `,
    });
  }

  const result = streamObject({
    model: openai("gpt-4.1-mini"),
    schema: generatedRecipeSchema,
    messages,
    temperature: 0.7,
    onError: (error) => {
      console.log("hit and error");
      console.log(error);
    },
  });

  // Create a tee stream that splits the response
  // let collectedChunks: string[] = [];
  // let partialObject: Partial<GeneratedRecipe> = {};
  // let updateTimer: ReturnType<typeof setTimeout> | null = null;

  // const updateDatabase = async (isComplete = false) => {
  //   try {
  //     const combinedText = collectedChunks.join("");

  //     // Try to parse the accumulated JSON to extract partial data
  //     try {
  //       const lines = combinedText.split("\n").filter((line) => line.trim());
  //       for (const line of lines) {
  //         if (line.startsWith("0:")) {
  //           const jsonStr = line.substring(2);
  //           const parsed = JSON.parse(jsonStr);
  //           partialObject = { ...partialObject, ...parsed };
  //         }
  //       }
  //     } catch (parseError) {
  //       // Continue if parsing fails - we'll try again with more data
  //     }

  //     // Update the database with current partial data
  //     const updateData: any = {
  //       status: isComplete ? "COMPLETED" : "PROCESSING",
  //     };

  //     if (partialObject.ingredients && partialObject.ingredients.length > 0) {
  //       updateData.ingredients = JSON.stringify(partialObject.ingredients);
  //     }

  //     if (partialObject.instructions && partialObject.instructions.length > 0) {
  //       updateData.instructions = JSON.stringify(partialObject.instructions);
  //     }

  //     await db.recipe.update({
  //       where: { id: body.recipeId },
  //       data: updateData,
  //     });
  //   } catch (error) {
  //     console.error("Error updating database:", error);
  //   }
  // };

  // const teeTransform = new TransformStream({
  //   transform(chunk, controller) {
  //     // Forward chunk to UI immediately
  //     controller.enqueue(chunk);

  //     // Collect chunk for database updates
  //     const chunkText = new TextDecoder().decode(chunk);
  //     collectedChunks.push(chunkText);

  //     // Schedule periodic database updates (debounced)
  //     if (updateTimer) {
  //       clearTimeout(updateTimer);
  //     }
  //     updateTimer = setTimeout(() => updateDatabase(false), 1000);
  //   },

  //   flush() {
  //     // Final update when stream completes
  //     if (updateTimer) {
  //       clearTimeout(updateTimer);
  //     }
  //     updateDatabase(true);
  //   },
  // });

  // const originalStream = result.toTextStreamResponse();
  // const teedStream = originalStream.body?.pipeThrough(teeTransform);

  // return new Response(teedStream, {
  //   headers: originalStream.headers,
  //   status: originalStream.status,
  //   statusText: originalStream.statusText,
  // });

  return result.toTextStreamResponse();
};

export default generateRecipeHandler;
