import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { userRoutes } from "@/app/pages/user/routes";
import { db, setupDb, type User } from "@/db";
import { env } from "cloudflare:workers";
import * as cookie from "cookie";
import { layout, prefix, render, route } from "rwsdk/router";
import { defineApp, ErrorResponse } from "rwsdk/worker";
import generateRecipeHandler from "./app/api/generate/recipe";
import generateSuggestionsHandler from "./app/api/generate/suggestions";
import generateRecipeTweaksHandler from "./app/api/generate/recipe-tweaks";
import generateIngredientSubstituteHandler from "./app/api/generate/ingredient-substitute";
import { Layout } from "./app/components/Layout";
import { MainPage } from "./app/pages";
import { RecipesPage } from "./app/pages/recipes";
import { RecipePage } from "./app/pages/recipes/[id]/recipe.page";
import { isTheme, type Theme } from "./app/shared/theme";
import { Session } from "./session/durableObject";
import { sessions, setupSessionStore } from "./session/store";
import generateRecipeSuggestionsHandler from "./app/api/generate/recipe-suggestions";
export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
  session: Session | null;
  user: User | null;
  theme: Theme | null;
  sidebar: boolean | null;
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      throw error;
    }

    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  async ({ ctx, request, headers }) => {
    const cookies = cookie.parse(request.headers.get("Cookie") || "");
    let theme: Theme;
    if (isTheme(cookies.theme)) {
      theme = cookies.theme;
    } else {
      theme = "light";
    }

    ctx.theme = theme;
    ctx.sidebar = cookies["sidebar_state_mealbot"] === "true" ? true : false;
  },
  render(
    Document,
    layout(Layout, [
      route("/", [
        ({ ctx }) => {
          if (!ctx.user) {
            return new Response(null, {
              status: 302,
              headers: { Location: "/user/login" },
            });
          }
        },
        MainPage,
      ]),
      prefix("/user", userRoutes),
      route("/recipes", RecipesPage),
      route("/recipes/:id", RecipePage),
    ])
  ),
  prefix("/api", [
    route("/generate/suggestions", generateSuggestionsHandler),
    route("/generate/recipe", generateRecipeHandler),
    route("/generate/recipe-tweaks", generateRecipeTweaksHandler),
    route(
      "/generate/ingredient-substitute",
      generateIngredientSubstituteHandler
    ),
    route("/generate/recipe-suggestions", generateRecipeSuggestionsHandler),
  ]),
]);
