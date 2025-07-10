import type { RequestInfo } from "rwsdk/worker";
import { db, type Recipe } from "@/db";
import { RecipePrompt } from "./components/recipe-prompt";
import { Layout } from "@/app/components/Layout";
import { Sparkles, ChefHat } from "lucide-react";
import { Suspense } from "react";

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
          className="bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-border hover:border-primary"
        >
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.title ?? ""}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {recipe.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
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
    <div className="container mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Create Amazing Recipes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tell us what you'd like to cook today and let our AI help you create
          the perfect recipe tailored to your taste
        </p>
      </div>

      {/* Recipe Prompt */}
      <RecipePrompt />
    </div>
  );
}
