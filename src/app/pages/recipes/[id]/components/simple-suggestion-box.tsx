"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecipeContext } from "../context/recipe-context";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSuggestionsSchema } from "@/app/api/generate/recipe-suggestions/schema";
import { Badge } from "@/components/ui/badge";

export function SimpleSuggestionBox() {
  const { modifyRecipe, isGenerating, recipe } = useRecipeContext();
  const [prompt, setPrompt] = useState("");

  const {
    submit: submitSuggestions,
    object,
    error: suggestionsError,
    isLoading: isSuggestionsLoading,
  } = useObject({
    api: "/api/generate/recipe-suggestions",
    schema: recipeSuggestionsSchema,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    modifyRecipe(prompt);
    setPrompt("");
  };

  useEffect(() => {
    submitSuggestions({ recipeId: recipe.id });
  }, [recipe]);

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex gap-2 flex-wrap">
        {object?.suggestions?.map((suggestion, index) => (
          <Badge key={index}>{suggestion?.suggestion}</Badge>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 w-md mx-auto">
        <Input
          placeholder="How can I modify this recipe? (e.g., add more spice)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          className="flex-1"
        />
        <Button type="submit" disabled={isGenerating || !prompt.trim()}>
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
