import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function isOverdue(date: Date | null | undefined): boolean {
  if (!date) return false;
  return date < new Date();
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
