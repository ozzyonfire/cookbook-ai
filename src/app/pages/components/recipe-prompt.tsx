"use client";

import {
  mealSuggestionsSchema,
  type MealSuggestion,
} from "@/app/api/generate/suggestions/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Clock, Plus, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { createRecipeFromSuggestion } from "./functions";
import MealSuggestionCard from "./meal-suggestion";
import {
  audience,
  cookingEquipment,
  cookingGoals,
  cookingTime,
  cuisines,
  dietaryRestrictions,
  dishTypes,
  mealTimes,
  occasions,
  proteins,
} from "./prompts";

export function RecipePrompt() {
  const [addTagValue, setAddTagValue] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  const handleSuggestionSelect = async (suggestion?: MealSuggestion) => {
    if (!suggestion) return;
    const result = await createRecipeFromSuggestion(selectedTags, suggestion);
    console.log(result);
    if (result.success) {
      window.location.href = `/recipes/${result.success}`;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            What should we make?
          </CardTitle>
          <CardDescription>
            All fields and tags are optional. Just select the ones you want to
            use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 h-[300px] overflow-y-auto outline outline-accent/20 rounded-md p-4">
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={proteins}
              title="Protein"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={cuisines}
              title="Cuisine"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={cookingTime}
              title="Cooking Time"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={cookingEquipment}
              title="Cooking Equipment"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={occasions}
              title="Occasion"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={dietaryRestrictions}
              title="Dietary Restrictions"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={cookingGoals}
              title="Cooking Goals"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={mealTimes}
              title="Meal Time"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={dishTypes}
              title="Dish Type"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={audience}
              title="Audience"
            />
          </div>
          {selectedTags.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <Button
                    variant="ghost"
                    className="m-0 p-0 h-4 w-4 rounded-full ml-1"
                    onClick={() =>
                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSelectedTags([...selectedTags, addTagValue.trim()]);
              setAddTagValue("");
            }}
          >
            <div className="flex gap-2">
              <Input
                required
                name="add-tag"
                placeholder="Add an ingredient, cuisine, or custom prompt..."
                value={addTagValue}
                onChange={(e) => setAddTagValue(e.target.value)}
              />
              <Button variant="outline" size="icon" type="submit">
                <p className="sr-only">Add</p>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit({ prompt, tags: selectedTags });
            }}
            className="w-full"
          >
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Creating suggestions...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Get cooking!
                </>
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>

      {/* Suggestions Section */}
      {object?.suggestions && object.suggestions.length > 0 && (
        // {true && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 text-foreground">
              Recipe Suggestions
            </h3>
            <p className="text-muted-foreground">
              Here are some recipe ideas that we think you'll like.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {object.suggestions.map((suggestion, index) => (
              // {sampleSuggestions.map((suggestion, index) => (
              <MealSuggestionCard
                key={index}
                suggestion={suggestion as MealSuggestion}
                onClick={handleSuggestionSelect}
              />
            ))}
          </div>
        </div>
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

function TagSelector({
  tags,
  selectedTags,
  setSelectedTags,
  title,
}: {
  tags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  title: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;
  const shouldShowExpandButton = tags.length > INITIAL_DISPLAY_COUNT;
  const tagsToShow = expanded ? tags : tags.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-muted-foreground">
        {title}
      </Label>
      <div className="flex items-center w-full gap-2 flex-wrap">
        {tagsToShow.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() =>
              setSelectedTags(
                selectedTags.includes(tag)
                  ? selectedTags.filter((t) => t !== tag)
                  : [...selectedTags, tag]
              )
            }
          >
            {tag}
          </Badge>
        ))}
        {shouldShowExpandButton && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            {expanded
              ? "Show less"
              : `+${tags.length - INITIAL_DISPLAY_COUNT} more`}
          </Button>
        )}
      </div>
    </div>
  );
}
