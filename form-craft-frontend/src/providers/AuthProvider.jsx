import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import auth from "../../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

// Google Provider

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  // Google sign in option
  const googleProvider = new GoogleAuthProvider();

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("User at authStateChange:", currentUser);

      if (currentUser) {
        const email = { email: currentUser?.email };

        try {
          // 1. Jwt generate during signup/login
          const tokenResponse = await axiosPublic.post("/jwt", email);
          console.log("AuthProvider Page token:", tokenResponse.data);

          if (tokenResponse.data.token) {
            localStorage.setItem("token", tokenResponse.data.token);
            setLoading(false);
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
      } else {
        localStorage.removeItem("token");
        setLoading(false);
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [axiosPublic, user?.email]);

  const authValue = {
    createUser,
    user,
    googleSignIn,
    loginUser,
    logOut,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

// if (currentUser) {
//   const email = currentUser?.email;
//   try {
//     setLoading(true);
//     const response = await axiosPublic.get(`/users/role/${email}`);
//     setUserRole(response.data.userRole);
//     setLoading(false);
//   } catch (error) {
//     console.log("Fetching role error", error);
//   }
// } else {
//   setUserRole(null);
//   setLoading(false);
// }

// if (!currentUser) {
//   // Remove token form LC
//   localStorage.removeItem("token");
// }

// console.log("observer:", currentUser);
