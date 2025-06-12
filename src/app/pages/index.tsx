import type { RequestInfo } from "rwsdk/worker";
import { db, type Recipe } from "@/db";
import { RecipePrompt } from "./components/recipe-prompt";

async function FeaturedRecipes() {
  const recipes = await db.recipe.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {recipes.map((recipe: Recipe) => (
        <div
          key={recipe.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.title ?? ""}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {recipe.title}
            </h3>
            <p className="text-gray-600 mt-2 line-clamp-2">
              {recipe.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export async function MainPage({ ctx }: RequestInfo) {
  const user = await db.user.findUnique({
    where: { id: ctx.user?.id },
  });

  if (!user) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user/login" },
    });
  }

  const savedRecipesCount = await db.recipe.count({
    where: { userId: user.id },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <RecipePrompt />
      </div>
    </div>
  );
}
