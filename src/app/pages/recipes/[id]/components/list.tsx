"use client";

import { Button } from "@/components/ui/button";
import type { Ingredient, Step } from "@generated/prisma";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useRecipeContext } from "../context/recipe-context";
import { IngredientSubstituteModal } from "./ingredient-substitute-modal";
import { ingredientSubstituteSchema } from "@/app/api/generate/ingredient-substitute/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { handleSubstituteIngredient } from "../functions";

function itemIsIngredient(item: Ingredient | Step): item is Ingredient {
  return "name" in item;
}

export function IngredientOrStepList({
  items,
  title,
}: {
  items: (Ingredient | Step)[];
  title: string;
}) {
  const { recipe } = useRecipeContext();
  const { submit, object, error, isLoading, stop } = useObject({
    api: "/api/generate/ingredient-substitute",
    schema: ingredientSubstituteSchema,
  });

  const [substituteModal, setSubstituteModal] = useState<{
    isOpen: boolean;
    ingredient: Ingredient;
    index: number;
  }>({
    isOpen: false,
    ingredient: {} as Ingredient,
    index: -1,
  });

  const handleSubstitute = (ingredient: Ingredient, index: number) => {
    submit({ ingredient, recipe });
    setSubstituteModal({
      isOpen: true,
      ingredient: ingredient,
      index,
    });
  };

  const handleSubstituteSelect = async (substitute: string) => {
    stop();

    await handleSubstituteIngredient(
      recipe.id,
      substituteModal.ingredient.id,
      substitute
    );

    setSubstituteModal((prev) => ({ ...prev, isOpen: false }));

    // TODO: regenerate the steps
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ol className="text-foreground list-inside list-decimal">
        {items.map((item, index) =>
          itemIsIngredient(item) ? (
            <IngredientListItem
              key={item.id}
              ingredient={item}
              onClick={() => handleSubstitute(item, index)}
            />
          ) : (
            <StepListItem key={item.id} step={item} />
          )
        )}
      </ol>

      <IngredientSubstituteModal
        isOpen={substituteModal.isOpen}
        onClose={() => {
          setSubstituteModal((prev) => ({ ...prev, isOpen: false }));
          stop();
        }}
        substitutes={object?.substitutes ?? []}
        ingredient={substituteModal.ingredient}
        onSubstitute={handleSubstituteSelect}
      />
    </div>
  );
}

export function IngredientListItem({
  ingredient,
  onClick,
}: {
  ingredient: Ingredient;
  onClick: () => void;
}) {
  return (
    <li key={ingredient.id} className="group">
      <div className="inline-flex items-center gap-4">
        <span>{ingredient.name}</span>
        <Button
          size="sm"
          variant="outline"
          className="ml-2 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onClick}
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Substitute
        </Button>
      </div>
    </li>
  );
}

export function StepListItem({ step }: { step: Step }) {
  return (
    <li key={step.id} className="group">
      <div className="inline-flex items-center gap-4">
        <span>{step.description}</span>
      </div>
    </li>
  );
}

export function StreamingList({
  items,
  title,
}: {
  items: (string | undefined)[];
  title: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ol className="text-foreground list-inside list-decimal">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  );
}
