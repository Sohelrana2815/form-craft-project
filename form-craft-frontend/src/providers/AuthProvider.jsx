import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import auth from "../../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const axiosPublic = useAxiosPublic();

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
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const email = currentUser?.email;
        try {
          setLoading(true);
          const response = await axiosPublic.get(`/users/role/${email}`);
          console.log(response.data);
          setUserRole(response.data.userRole);
          setLoading(false);
        } catch (error) {
          console.log("Fetching role error", error);
        }
      } else {
        setUserRole(null);
        setLoading(false);
      }

      if (!currentUser) {
        // Remove token form LC
        localStorage.removeItem("token");
      }

      // console.log("observer:", currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, [axiosPublic]);

  const authValue = {
    createUser,
    user,
    userRole,
    loginUser,
    logOut,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
