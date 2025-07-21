"use client";

import type { RecipeTweak } from "@/app/api/generate/recipe-tweaks/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChefHat, Clock, Lightbulb } from "lucide-react";

export default function RecipeTweakCard(props: {
  tweak: RecipeTweak;
  onClick: (tweak: RecipeTweak) => void;
}) {
  const { tweak } = props;

  return (
    <Card className="group relative overflow-hidden hover:bg-accent/10 transition-colors duration-200 hover:border-primary">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          {tweak?.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 grow">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {tweak?.description}
        </p>
        {tweak?.changes && tweak.changes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Changes:</h4>
            <div className="flex flex-wrap gap-1.5">
              {tweak.changes.slice(0, 3).map((change, changeIndex) => (
                <Badge key={changeIndex} variant="outline" className="text-xs">
                  {change}
                </Badge>
              ))}
              {tweak.changes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tweak.changes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          {tweak?.difficulty && (
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4 mr-1" />
              <span className="text-xs text-muted-foreground">
                {tweak.difficulty}
              </span>
            </div>
          )}
          {tweak?.time && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-xs text-muted-foreground">
                {tweak.time}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          className="w-full"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            props.onClick(tweak as RecipeTweak);
          }}
        >
          Try this variation!
        </Button>
      </CardFooter>
    </Card>
  );
}
