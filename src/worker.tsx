import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { userRoutes } from "@/app/pages/user/routes";
import { db, setupDb, type User } from "@/db";
import { env } from "cloudflare:workers";
import * as cookie from "cookie";
import { layout, prefix, render, route } from "rwsdk/router";
import { defineApp, ErrorResponse } from "rwsdk/worker";
import generateSuggestionsHandler from "./app/api/generate/suggestions";
import { Layout } from "./app/components/Layout";
import { MainPage } from "./app/pages";
import { RecipePage } from "./app/pages/recipe/RecipePage";
import { isTheme, type Theme } from "./app/shared/theme";
import { Session } from "./session/durableObject";
import { sessions, setupSessionStore } from "./session/store";
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
      route("/", MainPage),
      route("/protected", [
        ({ ctx }) => {
          if (!ctx.user) {
            return new Response(null, {
              status: 302,
              headers: { Location: "/user/login" },
            });
          }
        },
        Home,
      ]),
      prefix("/user", userRoutes),
      route("/recipe/:id", RecipePage),
    ])
  ),
  prefix("/api", [route("/generate/suggestions", generateSuggestionsHandler)]),
]);
