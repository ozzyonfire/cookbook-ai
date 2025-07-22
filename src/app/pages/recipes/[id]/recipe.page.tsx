import { db } from "@/db";
import { RequestInfo } from "rwsdk/worker";
import { RecipeClient } from "./recipe.client";
import { EditableRecipeView } from "./components/editable-recipe-view";
import { RecipeProvider } from "./providers/recipe-provider";

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

export type RecipeForPage = NonNullable<Awaited<ReturnType<typeof getRecipe>>>;

export async function RecipePage({ params }: RequestInfo) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    return new Response(null, { status: 404 });
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">{recipe.title}</h1>
          <p className="text-sm text-muted-foreground">{recipe.description}</p>
        </div>

        <RecipeProvider recipe={recipe}>
          <EditableRecipeView recipe={recipe} />
        </RecipeProvider>
      </div>
    </>
  );
}
