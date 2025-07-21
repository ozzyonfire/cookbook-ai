"use client";

import {
  recipeTweaksSchema,
  type RecipeTweak,
} from "@/app/api/generate/recipe-tweaks/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Clock, Lightbulb, Send, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { RecipeForPage } from "../recipe.page";
import { createRecipeFromTweak } from "../functions";
import RecipeTweakCard from "./recipe-tweak-card";

export function SuggestionBox(props: { recipe: RecipeForPage }) {
  const { recipe } = props;
  const [userPrompt, setUserPrompt] = useState("");
  const [showAutoSuggestions, setShowAutoSuggestions] = useState(false);

  // Hook for user-prompted tweaks
  const {
    submit: submitUserTweak,
    object: userTweakObject,
    error: userTweakError,
    isLoading: userTweakLoading,
  } = useObject({
    api: "/api/generate/recipe-tweaks",
    schema: recipeTweaksSchema,
    onFinish: (result) => {
      console.log("User tweak result:", result);
    },
    onError: (error) => {
      console.log("User tweak error:", error);
    },
  });

  // Hook for auto-generated suggestions
  const {
    submit: submitAutoSuggestions,
    object: autoSuggestionsObject,
    error: autoSuggestionsError,
    isLoading: autoSuggestionsLoading,
  } = useObject({
    api: "/api/generate/recipe-tweaks",
    schema: recipeTweaksSchema,
    onFinish: (result) => {
      console.log("Auto suggestions result:", result);
    },
    onError: (error) => {
      console.log("Auto suggestions error:", error);
    },
  });

  // Auto-generate suggestions when component mounts if recipe is completed
  useEffect(() => {
    if (recipe?.status === "COMPLETED" && !showAutoSuggestions && recipe.id) {
      setShowAutoSuggestions(true);
      submitAutoSuggestions({
        recipeId: recipe.id,
        generateAuto: true,
      });
    }
  }, [recipe, submitAutoSuggestions, showAutoSuggestions]);

  const handleUserTweakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim() || !recipe?.id) return;

    submitUserTweak({
      recipeId: recipe.id,
      userPrompt: userPrompt.trim(),
      generateAuto: false,
    });
  };

  const handleTweakSelect = async (tweak: RecipeTweak) => {
    if (!recipe?.id) return;

    const result = await createRecipeFromTweak(recipe.id, tweak);
    if (result.success) {
      window.location.href = `/recipes/${result.success}`;
    } else {
      console.error("Failed to create recipe:", result.error);
    }
  };

  if (!recipe || recipe.status !== "COMPLETED") {
    return null;
  }

  return (
    <div className="space-y-8 mt-8">
      {/* User Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Tweak This Recipe
          </CardTitle>
          <CardDescription>
            Tell us how you'd like to modify this recipe and we'll generate
            variations for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserTweakSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-prompt">
                What would you like to change?
              </Label>
              <Textarea
                id="user-prompt"
                placeholder="e.g., make it vegetarian, add more spices, make it healthier, use different cooking method..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button
              type="submit"
              disabled={userTweakLoading || !userPrompt.trim()}
            >
              {userTweakLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating variations...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate Variations
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* User Tweaks Results */}
      {userTweakObject?.suggestions &&
        userTweakObject.suggestions.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-foreground">
                Your Recipe Variations
              </h3>
              <p className="text-muted-foreground">
                Here are some variations based on your request.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userTweakObject.suggestions.map((tweak, index) => (
                <RecipeTweakCard
                  key={index}
                  tweak={tweak as RecipeTweak}
                  onClick={handleTweakSelect}
                />
              ))}
            </div>
          </div>
        )}

      {/* Auto-Generated Suggestions */}
      {autoSuggestionsObject?.suggestions &&
        autoSuggestionsObject.suggestions.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-foreground flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Recipe Inspirations
              </h3>
              <p className="text-muted-foreground">
                Here are some creative variations we think you might enjoy.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {autoSuggestionsObject.suggestions.map((tweak, index) => (
                <RecipeTweakCard
                  key={index}
                  tweak={tweak as RecipeTweak}
                  onClick={handleTweakSelect}
                />
              ))}
            </div>
          </div>
        )}

      {/* Error States */}
      {userTweakError && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              {userTweakError.message}
            </p>
          </CardContent>
        </Card>
      )}

      {autoSuggestionsError && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              {autoSuggestionsError.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading States */}
      {autoSuggestionsLoading && !autoSuggestionsObject && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              <p className="text-muted-foreground">
                Generating recipe inspirations...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
