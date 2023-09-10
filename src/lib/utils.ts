import { ClassValue, clsx } from "clsx";
import { twMerge } from "tw-merge";

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input));
}
export const getChatCode = (id1: string, id2: string) =>
  [id1, id2].sort().join("--");

export function toPusher(key: string) {
  return key.replace(/:/g, "__");
}
