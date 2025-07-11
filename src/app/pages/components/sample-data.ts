import type { MealSuggestion } from "@/app/api/generate/suggestions/schema";

export const sampleSuggestions: MealSuggestion[] = [
  {
    title: "Quick Lamb Stir-Fry",
    description:
      "A fast and flavorful lamb stir-fry with vegetables and a savory sauce, ready in under 20 minutes.",
    ingredients: [
      "lamb strips",
      "bell peppers",
      "onion",
      "soy sauce",
      "garlic",
      "ginger",
      "olive oil",
    ],
    difficulty: "easy",
    time: "20 minutes",
  },
  {
    title: "Lamb and Mint Wraps",
    description:
      "Tender lamb cooked quickly with fresh mint and spices, served in warm wraps for a delicious meal.",
    ingredients: [
      "ground lamb",
      "mint leaves",
      "cumin",
      "tortillas",
      "yogurt",
      "garlic",
      "olive oil",
    ],
    difficulty: "easy",
    time: "15 minutes",
  },
  {
    title: "Spicy Lamb Lettuce Cups",
    description:
      "Ground lamb cooked with spicy seasonings, served in crisp lettuce cups for a light and quick meal.",
    ingredients: [
      "ground lamb",
      "lettuce leaves",
      "chili flakes",
      "garlic",
      "onion",
      "soy sauce",
      "olive oil",
    ],
    difficulty: "easy",
    time: "20 minutes",
  },
];
