import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function ensureUserInFirestore(uid, email, displayName = null) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: email || "",
        displayName: displayName || email || "User",
        createdAt: new Date().toISOString(),
      });
    }
  }

  async function loginWithEmail(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserInFirestore(cred.user.uid, cred.user.email, cred.user.displayName);
    return cred;
  }

  async function signUpWithEmail(email, password, displayName = null) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserInFirestore(cred.user.uid, cred.user.email, displayName || email);
    return cred;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await ensureUserInFirestore(
      cred.user.uid,
      cred.user.email,
      cred.user.displayName || cred.user.email
    );
    return cred;
  }

  function logout() {
    return signOut(auth);
  }

  const value = {
    user,
    loading,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
