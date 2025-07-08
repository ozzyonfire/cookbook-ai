export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

export function isTheme(theme: string | undefined): theme is Theme {
  console.log("theme", theme);
  return themes.includes(theme as Theme);
}
