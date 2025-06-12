"use client";

import type { Recipe } from "@generated/prisma";
import { useCompletion } from "ai/react";

export function RecipeClient({ recipe }: { recipe: Recipe }) {
  return <div>RecipeClient</div>;
}
