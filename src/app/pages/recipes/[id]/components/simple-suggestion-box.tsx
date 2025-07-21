"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import type { RecipeForPage } from "../recipe.page";

export function SimpleSuggestionBox({
  recipe,
}: {
  recipe: NonNullable<RecipeForPage>;
}) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    // TODO: Implement API call to modify recipe
    console.log("Modifying recipe with prompt:", prompt);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setPrompt("");
  };

  return (
    <div className="mt-6 p-4 border border-border rounded-lg bg-accent/20">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Tell me how to modify this recipe... (e.g., make it vegetarian, add more spice)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
