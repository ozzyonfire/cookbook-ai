"use client";

import {
  generatedRecipeSchema,
  type GeneratedRecipe,
} from "@/app/api/generate/recipe/schema";
import type { PartialObject } from "@/lib/utils";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import {
  handleRegenerateRecipe,
  handleSaveGeneratedRecipe,
} from "../functions";
import type { RecipeForPage } from "../recipe.page";

interface RecipeContextType {
  recipe: RecipeForPage;
  error: Error | undefined;
  isGenerating: boolean;
  generatedRecipe: PartialObject<GeneratedRecipe> | undefined;
  generateRecipe: () => void;
  modifyRecipe: (modification: string) => void;
  regenerateRecipe: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({
  children,
  recipe,
}: {
  children: ReactNode;
  recipe: RecipeForPage;
}) {
  const { submit, object, error, isLoading } = useObject({
    api: "/api/generate/recipe",
    schema: generatedRecipeSchema,
    onFinish: (result) => {
      if (result.object) {
        handleSaveGeneratedRecipe(recipe.id, result.object);
      }
    },
    onError: (error) => {
      console.log("hit and error");
      console.log(error);
    },
  });

  const generateRecipe = useCallback(() => {
    submit({
      recipeId: recipe.id,
    });
  }, [submit, recipe.id]);

  const modifyRecipe = useCallback(
    (modification: string) => {
      if (isLoading) return;
      submit({
        recipeId: recipe.id,
        modification,
      });
    },
    [submit, recipe.id]
  );

  const regenerateRecipe = useCallback(() => {
    if (isLoading) return;
    handleRegenerateRecipe(recipe.id);
  }, [recipe]);

  useEffect(() => {
    if (recipe.status === "PENDING" || recipe.status === "PROCESSING") {
      generateRecipe();
    }
  }, [recipe, generateRecipe]);

  return (
    <RecipeContext.Provider
      value={{
        recipe,
        error,
        isGenerating: isLoading,
        generatedRecipe: object,
        generateRecipe,
        modifyRecipe,
        regenerateRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipeContext must be used within an RecipeProvider");
  }
  return context;
}
