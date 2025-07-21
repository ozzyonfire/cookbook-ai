"use client";

import type { Recipe } from "@generated/prisma";
import { createContext, useContext, useState, type ReactNode } from "react";

interface RecipeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  recipe: Recipe;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({
  children,
  recipe,
}: {
  children: ReactNode;
  recipe: Recipe;
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <RecipeContext.Provider value={{ isEditMode, toggleEditMode, recipe }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useEdit must be used within an RecipeProvider");
  }
  return context;
}
