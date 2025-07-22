import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PartialObject<T> = {
  [K in keyof T]?: T[K] extends object ? PartialObject<T[K]> : T[K];
};
