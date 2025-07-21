import { db } from "@/db";
import { RequestInfo } from "rwsdk/worker";
import { RecipeClient } from "./recipe.client";
import { IngredientOrStepList } from "./components/list";
import { SuggestionBox } from "./components/suggestion-box";
import { Button } from "@/components/ui/button";
import { Pencil, Star, Trash } from "lucide-react";

async function getRecipe(id: string) {
  const recipe = await db.recipe.findUnique({
    where: {
      id,
    },
    include: {
      ingredients: true,
      steps: true,
    },
  });

  return recipe;
}

export type RecipeForPage = Awaited<ReturnType<typeof getRecipe>>;

export async function RecipePage({ params }: RequestInfo) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    return new Response(null, { status: 404 });
  }

  console.log(recipe);

  return (
    <>
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
            <IngredientOrStepList
              items={recipe.steps.map((step) => step.description)}
              title="Steps"
            />
          </div>
        ) : (
          <RecipeClient recipe={recipe} />
        )}

        {/* <SuggestionBox recipe={recipe} /> */}
      </div>
      <div className="sticky bottom-4 mt-4">
        <div className="flex justify-center gap-2 bg-background/80 backdrop-blur-sm border p-2 rounded-lg border-border/50 shadow-lg w-fit mx-auto">
          <Button variant="default">
            <Star className="w-4 h-4" />
            Review
          </Button>
          <Button variant="outline">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
