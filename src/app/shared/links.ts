import { defineLinks } from "rwsdk/router";

export const link = defineLinks([
  "/",
  "/user/login",
  "/user/logout",
  "/recipe/:id",
  "/recipes/:id",
  "/recipes",
]);

export type Path = Parameters<typeof link>[0];
