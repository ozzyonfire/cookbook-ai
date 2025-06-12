import { route, type RouteDefinition } from "rwsdk/router";
import { Login } from "./Login";
import { sessions } from "@/session/store";

export const userRoutes: RouteDefinition[] = [
  route("/login", [Login]),
  route("/logout", async function ({ request }) {
    const headers = new Headers();
    await sessions.remove(request, headers);
    headers.set("Location", "/");

    return new Response(null, {
      status: 302,
      headers,
    });
  }),
];
