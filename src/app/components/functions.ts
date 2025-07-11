"use server";

import { db } from "@/db";
import { getRequestInfo } from "rwsdk/worker";

export async function getUserRecipes() {
  const { ctx } = getRequestInfo();

  if (!ctx.user) {
    return [];
  }

  const recipes = await db.recipe.findMany({
    where: { userId: ctx.user.id },
    orderBy: { createdAt: "desc" },
    take: 10, // Limit to 10 most recent recipes
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  return recipes;
}
