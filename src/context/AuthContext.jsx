import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  updateProfile,
} from "firebase/auth";
import { auth } from "../auth/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.reload().then(() => {
          setCurrentUser(user);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName,
        });
        await result.user.reload();
      }

      return result;
    } catch (error) {
      console.error("Sign up error:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          throw new Error("This email is already registered. Try logging in.");
        case "auth/invalid-email":
          throw new Error("Please enter a valid email address.");
        case "auth/weak-password":
          throw new Error("Password should be at least 6 characters.");
        default:
          throw new Error("Something went wrong. Please try again.");
      }
    }
  };

  const signIn = async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful:", result);
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      switch (error.code) {
        case "auth/invalid-email":
          throw new Error("Invalid email address");
        case "auth/user-disabled":
          throw new Error("This account has been disabled");
        case "auth/user-not-found":
          throw new Error("No account found with this email");
        case "auth/wrong-password":
          throw new Error("Incorrect password");
        case "auth/too-many-requests":
          throw new Error("Too many failed attempts. Please try again later");
        default:
          throw new Error("Failed to sign in. Please try again");
      }
    }
  };

  const logOut = () => {
    return signOut(auth);
  };

  const signUpProvider = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      if (error.code === "auth/popup-blocked") {
        throw new Error(
          "Please allow popups for this site to sign in with Google"
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign in was cancelled");
      } else if (error.code === "auth/cancelled-popup-request") {
        throw new Error("Please try signing in again");
      } else {
        console.error("Google sign-in error:", error);
        throw error;
      }
    }
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    signUp,
    signIn,
    logOut,
    signUpProvider,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
