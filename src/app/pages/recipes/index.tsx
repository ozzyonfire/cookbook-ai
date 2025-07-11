import type { RequestInfo } from "rwsdk/worker";
import { db, type Recipe } from "@/db";
import { Layout } from "@/app/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { link } from "@/app/shared/links";
import { BookOpen, Calendar, ChefHat, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function RecipesPage({ ctx }: RequestInfo) {
  const user = await db.user.findUnique({
    where: { id: ctx.user?.id },
  });

  if (!user) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user/login" },
    });
  }

  const recipes = await db.recipe.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent leading-tight">
          Your Recipe Collection
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {recipes.length === 0
            ? "Start building your personal cookbook with AI-generated recipes"
            : `Discover ${recipes.length} amazing recipe${
                recipes.length === 1 ? "" : "s"
              } in your collection`}
        </p>
      </div>

      {recipes.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-lg mx-auto w-fit">
                <ChefHat className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Ready to start cooking?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  You haven't saved any recipes yet. Create your first
                  AI-powered recipe and start building your personal cookbook.
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                // onClick={() => {
                //   window.location.href = "/";
                // }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Recipe
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe: Recipe) => (
            <a href={link("/recipes/:id", { id: recipe.id })}>
              <Card
                key={recipe.id}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:border-slate-300 dark:hover:border-slate-600"
                // onClick={() => {
                //   window.location.href = link("/recipe/:id", {
                //     id: recipe.id,
                //   });
                // }}
              >
                {recipe.imageUrl ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title ?? ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                    <ChefHat className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 line-clamp-2">
                    {recipe.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Created{" "}
                      {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}

      {recipes.length > 0 && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
            // onClick={() => {
            //   window.location.href = "/";
            // }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Another Recipe
          </Button>
        </div>
      )}
    </div>
  );
}
