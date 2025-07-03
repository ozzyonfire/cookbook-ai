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
import { useActionState, useEffect, useState } from "react";
import { link } from "@/app/shared/links";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { mealSuggestionsSchema } from "@/app/api/generate/suggestions/schema";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Check, Clock } from "lucide-react";

export function RecipePrompt() {
  const [state, formAction] = useActionState(handleNewRecipe, null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const { submit, object, error, isLoading } = useObject({
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

  const handleSuggestionSelect = (suggestion: any) => {
    setSelectedSuggestion(suggestion.title);
    // You can add additional logic here to handle the selection
    // For example, auto-fill the textarea or trigger a recipe generation
  };

  return (
    <div className="space-y-8">
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
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-primary" />
              What would you like to cook?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              name="prompt"
              required
              placeholder="Describe what you want to cook... (e.g., 'A healthy pasta dish with vegetables' or 'Something spicy for dinner')"
              className="resize-none min-h-[120px]"
              disabled={isLoading}
            />
            {state?.error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-destructive text-sm">{state.error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Creating suggestions...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Let's Cook!
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Suggestions Section */}
      {object?.suggestions && object.suggestions.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Recipe Suggestions</h3>
            <p className="text-muted-foreground">
              Choose one of these AI-generated recipe ideas
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {object.suggestions.map((suggestion, index) => (
              <Card
                key={`${suggestion?.title}-${index}`}
                className={`group relative overflow-hidden cursor-pointer ${
                  selectedSuggestion === suggestion?.title
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary">
                    {suggestion?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {suggestion?.description}
                  </p>
                  {suggestion?.tags && suggestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {suggestion.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {suggestion.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{suggestion.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    size="sm"
                    className="w-full"
                    variant={
                      selectedSuggestion === suggestion?.title
                        ? "default"
                        : "secondary"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSuggestionSelect(suggestion);
                    }}
                  >
                    {selectedSuggestion === suggestion?.title ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-2" />
                        Selected
                      </>
                    ) : (
                      "Select Recipe"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !object?.suggestions && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-primary animate-spin" />
              <p className="text-muted-foreground">
                AI is crafting your recipe suggestions...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {object?.suggestions?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No suggestions found. Try describing what you'd like to cook in
              more detail.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
