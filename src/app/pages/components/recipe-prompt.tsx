"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { handleNewRecipe } from "./functions";
import { useActionState, useEffect } from "react";
import { link } from "@/app/shared/links";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { mealSuggestionsSchema } from "@/app/api/generate/suggestions/schema";

export function RecipePrompt() {
  const [state, formAction] = useActionState(handleNewRecipe, null);
  const { submit, object, error } = useObject({
    api: "/api/generate/suggestions",
    schema: mealSuggestionsSchema,
    onFinish: (result) => {
      console.log(result);
    },
    onError: (error) => {
      console.log("hit and error");
      console.log(error);
    },
  });

  useEffect(() => {
    if (state?.success) {
      window.location.href = link("/recipe/:id", {
        id: state.success,
      });
    }
  }, [state]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const prompt = formData.get("prompt") as string;
          submit({ prompt });
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recipe Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="prompt"
              required
              placeholder="What do you want to make today?"
              className="resize-none"
            />
            {state?.error && <p className="text-red-500">{state.error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit">Let's Cook!</Button>
          </CardFooter>
        </Card>
      </form>
      <div className="flex flex-col gap-2">
        {object?.suggestions?.map((suggestion) => (
          <div key={suggestion?.title}>
            <p>{suggestion?.title}</p>
            <p>{suggestion?.description}</p>
            <p>{suggestion?.tags?.join(", ")}</p>
          </div>
        ))}
        {object?.suggestions?.length === 0 && (
          <p className="text-muted-foreground">No suggestions found</p>
        )}
      </div>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
