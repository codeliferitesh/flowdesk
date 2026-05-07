import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: Timestamp;
}

export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Timestamp;
  tags: string[];
  categoryId?: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  archived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Timestamp;
}

export interface Board {
  id: string;
  userId: string;
  name: string;
  columns: BoardColumn[];
  createdAt: Timestamp;
}

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
  cards: BoardCard[];
}

export interface BoardCard {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Timestamp;
}

export const NOTE_COLORS = [
  "#fef9c3",
  "#dcfce7",
  "#dbeafe",
  "#fce7f3",
  "#f3e8ff",
  "#ffedd5",
  "#e0f2fe",
  "#d1fae5",
];

export const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800" },
  medium: { label: "Medium", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800" },
  high: { label: "High", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-800" },
};
