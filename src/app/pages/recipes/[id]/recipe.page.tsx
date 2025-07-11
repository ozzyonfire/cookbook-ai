import { db } from "@/db";
import { RequestInfo } from "rwsdk/worker";
import { RecipeClient } from "./recipe.client";
import { IngredientOrStepList } from "./components/list";

export async function RecipePage({ params }: RequestInfo) {
  const recipe = await db.recipe.findUnique({
    where: {
      id: params.id as string,
    },
    include: {
      ingredients: true,
      steps: true,
    },
  });

  if (!recipe) {
    return new Response(null, { status: 404 });
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-foreground">{recipe.title}</h1>
      <p className="text-sm text-muted-foreground">{recipe.description}</p>
      {recipe.status === "COMPLETED" ? (
        <div className="space-y-4 mt-8">
          <IngredientOrStepList
            items={recipe.ingredients.map((ingredient) => ingredient.name)}
            title="Ingredients"
          />
          <IngredientOrStepList
            items={recipe.steps.map((step) => step.description)}
            title="Steps"
          />
        </div>
      ) : (
        <RecipeClient recipe={recipe} />
      )}
    </div>
  );
}
