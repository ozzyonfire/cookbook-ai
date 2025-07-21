"use client";

import type { MealSuggestion } from "@/app/api/generate/suggestions/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChefHat, Clock } from "lucide-react";

export default function MealSuggestionCard(props: {
  suggestion: MealSuggestion;
  onClick: (suggestion: MealSuggestion) => void;
}) {
  const { suggestion } = props;

  return (
    <Card className="group relative overflow-hidden hover:bg-accent/10 transition-colors duration-200 hover:border-primary">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {suggestion?.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 grow">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {suggestion?.description}
        </p>
        {suggestion?.ingredients && suggestion.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestion.ingredients.slice(0, 3).map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          {suggestion?.difficulty && (
            <div className="flex items-center gap-1">
              <ChefHat className="h-5 w-5 mr-1" />
              <span className="text-xs text-muted-foreground">
                {suggestion.difficulty}
              </span>
            </div>
          )}
          {suggestion?.time && (
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5 mr-1" />
              <span className="text-xs text-muted-foreground">
                {suggestion.time}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          className="w-full"
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            props.onClick(suggestion as MealSuggestion);
          }}
        >
          Make this!
        </Button>
      </CardFooter>
    </Card>
  );
}
