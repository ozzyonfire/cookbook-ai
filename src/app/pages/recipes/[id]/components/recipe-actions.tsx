"use client";

import { Button } from "@/components/ui/button";
import { Star, Trash } from "lucide-react";
import { handleRegenerateRecipe } from "../functions";
import { useRecipeContext } from "../context/recipe-context";

export function RecipeActions() {
  const { recipe } = useRecipeContext();

  return (
    <div className="sticky bottom-4 mt-4">
      <div className="flex justify-center gap-2 bg-background/80 backdrop-blur-sm border p-2 rounded-lg border-border/50 shadow-lg w-fit mx-auto">
        <Button variant="default">
          <Star className="w-4 h-4" />
          Review
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await handleRegenerateRecipe(recipe.id);
          }}
        >
          Regenerate
        </Button>
        <Button variant="destructive">
          <Trash className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
