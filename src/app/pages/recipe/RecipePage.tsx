import { db } from "@/db";
import { RequestInfo } from "rwsdk/worker";
import { RecipeClient } from "./recipe.client";

export async function RecipePage({ params }: RequestInfo) {
  const recipe = await db.recipe.findUnique({
    where: {
      id: params.id as string,
    },
  });

  if (!recipe) {
    return new Response(null, { status: 404 });
  }

  return <RecipeClient recipe={recipe} />;
}
