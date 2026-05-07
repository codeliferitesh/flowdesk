import {
  collection, doc, addDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category } from "@/types";

export const categoryService = {
  subscribe(userId: string, callback: (cats: Category[]) => void) {
    const q = query(collection(db, "categories"), where("userId", "==", userId), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)));
    });
  },

  async create(userId: string, name: string, color: string) {
    await addDoc(collection(db, "categories"), {
      userId, name, color, createdAt: serverTimestamp(),
    });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, "categories", id));
  },
};
