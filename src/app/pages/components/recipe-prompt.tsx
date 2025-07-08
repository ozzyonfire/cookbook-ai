"use client";
import {
  mealSuggestionsSchema,
  type MealSuggestion,
} from "@/app/api/generate/suggestions/schema";
import { link } from "@/app/shared/links";
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
import { Textarea } from "@/components/ui/textarea";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import {
  Check,
  ChevronsUpDown,
  Clock,
  Send,
  Sparkles,
  Tag,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { createRecipeFromSuggestion, handleNewRecipe } from "./functions";
import {
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
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";

export function RecipePrompt() {
  // const [state, formAction] = useActionState(handleNewRecipe, null);
  const [prompt, setPrompt] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  // useEffect(() => {
  //   if (state?.success) {
  //     window.location.href = link("/recipe/:id", {
  //       id: state.success,
  //     });
  //   }
  // }, [state]);

  const handleSuggestionSelect = (suggestion?: MealSuggestion) => {
    if (!suggestion) return;
    setSelectedSuggestion(suggestion.title);
    createRecipeFromSuggestion(prompt, suggestion);
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit({ prompt });
        }}
      >
        <Card className="max-w-xl mx-auto group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-0 transition-all duration-200">
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
          <CardContent className="space-y-1">
            <Combobox
              className="w-full"
              options={[
                { label: "Protein", values: proteins },
                { label: "Cuisine", values: cuisines },
                { label: "Cooking Time", values: cookingTime },
              ]}
              selectedValues={selectedTags}
              onChange={(value) => {
                setSelectedTags((prev) => {
                  if (prev.includes(value)) {
                    return prev.filter((tag) => tag !== value);
                  }
                  return [...prev, value];
                });
              }}
              placeholder="Select a protein"
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={proteins}
              title="Protein"
              defaultOpen
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={cuisines}
              title="Cuisine"
              defaultOpen
            />
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={cookingTime}
              title="Cooking Time"
              defaultOpen
            />
            <Collapsible>
              <CollapsibleContent className="space-y-1">
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
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  More tags...
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            {/* <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const addTag = formData.get("add-tag") as string;
                if (addTag) {
                  setSelectedTags([...selectedTags, addTag]);
                }
                e.currentTarget.reset();
              }}
            >
              <Input required name="add-tag" placeholder="Add a tag..." />
            </form> */}

            {/* <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              placeholder="Describe what you want to cook... (e.g., 'A healthy pasta dish with vegetables' or 'Something spicy for dinner')"
              className="resize-none min-h-[120px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0 focus-visible:border-0"
              disabled={isLoading}
            /> */}
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
                  Let's go!
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
              Here are some recipe ideas that we think you'll like.
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
                  {suggestion?.ingredients &&
                    suggestion.ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {suggestion.ingredients
                          .slice(0, 3)
                          .map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    )}
                  {suggestion?.difficulty && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.difficulty}
                    </Badge>
                  )}
                  {suggestion?.time && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.time}
                    </Badge>
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
                      handleSuggestionSelect(suggestion as MealSuggestion);
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

function TagSelector({
  tags,
  selectedTags,
  setSelectedTags,
  title,
  defaultOpen,
}: {
  tags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  title: string;
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const INITIAL_DISPLAY_COUNT = 5;
  const shouldShowExpandButton = tags.length > INITIAL_DISPLAY_COUNT;
  const tagsToShow = expanded ? tags : tags.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      {/* <Label>{title}</Label> */}
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6">
          {title}
          {open ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex items-center w-full overflow-x-auto gap-2 flex-wrap my-1">
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
      </CollapsibleContent>
    </Collapsible>
  );
}
