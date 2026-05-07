import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export const authService = {
  async signUp(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await setDoc(doc(db, "users", credential.user.uid), {
      id: credential.user.uid,
      name,
      email,
      photoURL: null,
      createdAt: serverTimestamp(),
    });
    return credential.user;
  },

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  },

  async loginWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    const user = credential.user;
    await setDoc(
      doc(db, "users", user.uid),
      {
        id: user.uid,
        name: user.displayName ?? "User",
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    return user;
  },

  async logout() {
    await signOut(auth);
  },

  async forgotPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },
};
