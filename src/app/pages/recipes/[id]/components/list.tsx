import type { Ingredient, Step } from "@generated/prisma";

export function IngredientOrStepList({
  items,
  title,
}: {
  items: (string | undefined)[];
  title: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ol className="list-decimal list-inside text-foreground">
        {items.map((item) => (
          <li key={item || ""}>{item}</li>
        ))}
      </ol>
    </div>
  );
}
