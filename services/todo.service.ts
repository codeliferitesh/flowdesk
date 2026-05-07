import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Todo, Priority } from "@/types";

export const todoService = {
  subscribe(userId: string, callback: (todos: Todo[]) => void) {
    const q = query(
      collection(db, "todos"),
      where("userId", "==", userId),
      orderBy("order", "asc"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Todo)));
    });
  },

  async create(userId: string, data: { title: string; description?: string; priority: Priority; dueDate?: Date; tags?: string[]; categoryId?: string; order?: number }) {
    await addDoc(collection(db, "todos"), {
      userId,
      title: data.title,
      description: data.description ?? "",
      completed: false,
      priority: data.priority,
      dueDate: data.dueDate ? Timestamp.fromDate(data.dueDate) : null,
      tags: data.tags ?? [],
      categoryId: data.categoryId ?? null,
      order: data.order ?? Date.now(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async update(id: string, data: Partial<Omit<Todo, "id" | "userId" | "createdAt">>) {
    await updateDoc(doc(db, "todos", id), { ...data, updatedAt: serverTimestamp() });
  },

  async toggle(id: string, completed: boolean) {
    await updateDoc(doc(db, "todos", id), { completed, updatedAt: serverTimestamp() });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, "todos", id));
  },
};
