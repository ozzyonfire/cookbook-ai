"use client";

import {
  ingredientSubstituteSchema,
  type IngredientSubstitute,
} from "@/app/api/generate/ingredient-substitute/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type { Ingredient, Recipe } from "@generated/prisma";
import { Loader2, RefreshCw } from "lucide-react";
import { useRecipeContext } from "./recipe-context";
import { useEffect } from "react";

interface IngredientSubstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient;
  onSubstitute: (substitute: string) => void;
}

export function IngredientSubstituteModal({
  isOpen,
  onClose,
  ingredient,
  onSubstitute,
}: IngredientSubstituteModalProps) {
  const { recipe } = useRecipeContext();
  const { submit, object, error, isLoading } = useObject({
    api: "/api/generate/ingredient-substitute",
    schema: ingredientSubstituteSchema,
  });

  useEffect(() => {
    if (isOpen) {
      submit({ ingredient, recipe });
    }
  }, [isOpen, submit]);

  const handleSelectSubstitute = (substitute: IngredientSubstitute) => {
    onSubstitute(substitute.ingredient);
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Substitute for {ingredient.name}
          </DialogTitle>
          <DialogDescription>
            Here are some alternatives you can use instead.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">
                Finding substitutes...
              </span>
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm text-center py-4">
              Failed to find substitutes. Please try again.
            </div>
          )}

          {object?.substitutes && (
            <div className="space-y-3">
              {object.substitutes.map((substitute, index) => {
                if (!substitute?.ingredient) return null;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">
                            {substitute.ingredient}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {substitute.ratio || "1:1"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {substitute.reason || "Good substitute"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSelectSubstitute(
                            substitute as IngredientSubstitute
                          )
                        }
                        className="ml-2"
                      >
                        Use This
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
