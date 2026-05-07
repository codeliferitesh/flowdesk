import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Note } from "@/types";

export const noteService = {
  subscribe(userId: string, callback: (notes: Note[]) => void) {
    const q = query(
      collection(db, "notes"),
      where("userId", "==", userId),
      where("archived", "==", false),
      orderBy("pinned", "desc"),
      orderBy("updatedAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Note)));
    });
  },

  async create(userId: string, data: { title: string; content: string; color: string }) {
    await addDoc(collection(db, "notes"), {
      userId,
      title: data.title,
      content: data.content,
      color: data.color,
      pinned: false,
      archived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async update(id: string, data: Partial<Omit<Note, "id" | "userId" | "createdAt">>) {
    await updateDoc(doc(db, "notes", id), { ...data, updatedAt: serverTimestamp() });
  },

  async pin(id: string, pinned: boolean) {
    await updateDoc(doc(db, "notes", id), { pinned, updatedAt: serverTimestamp() });
  },

  async archive(id: string) {
    await updateDoc(doc(db, "notes", id), { archived: true, updatedAt: serverTimestamp() });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, "notes", id));
  },
};
