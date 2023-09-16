import { ClassValue, clsx } from "clsx";
import { twMerge } from "tw-merge";

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input));
}
