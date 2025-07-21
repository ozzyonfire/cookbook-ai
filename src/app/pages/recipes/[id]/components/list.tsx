"use client";

import { Button } from "@/components/ui/button";
import type { Ingredient, Step } from "@generated/prisma";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useRecipeContext } from "./recipe-context";
import { IngredientSubstituteModal } from "./ingredient-substitute-modal";

function itemIsIngredient(item: Ingredient | Step): item is Ingredient {
  return "name" in item;
}

export function IngredientOrStepList({
  items,
  title,
}: {
  items: (Ingredient | Step)[];
  title: string;
  isEditMode?: boolean;
}) {
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
    setSubstituteModal({
      isOpen: true,
      ingredient: ingredient,
      index,
    });
  };

  const handleSubstituteSelect = (substitute: string) => {
    // TODO: Update the ingredient in the recipe
    console.log(
      "Selected substitute:",
      substitute,
      "for index:",
      substituteModal.index
    );
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
              index={index}
              onClick={() => handleSubstitute(item, index)}
            />
          ) : (
            <StepListItem key={item.id} step={item} />
          )
        )}
      </ol>

      <IngredientSubstituteModal
        isOpen={substituteModal.isOpen}
        onClose={() =>
          setSubstituteModal((prev) => ({ ...prev, isOpen: false }))
        }
        ingredient={substituteModal.ingredient}
        onSubstitute={handleSubstituteSelect}
      />
    </div>
  );
}

export function IngredientListItem({
  ingredient,
  index,
  onClick,
}: {
  ingredient: Ingredient;
  index: number;
  onClick: () => void;
}) {
  const { isEditMode } = useRecipeContext();

  return (
    <li key={ingredient.id} className="group">
      <div className="inline-flex items-center gap-4">
        <span>{ingredient.name}</span>
        {isEditMode && (
          <Button
            size="sm"
            variant="outline"
            className="ml-2 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onClick}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Substitute
          </Button>
        )}
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
