import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { IAuthState } from "@/interfaces";

const useAuth = () => {
  const [authState, setAuthState] = useState<IAuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setAuthState({
          isAuthenticated: true,
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
};

export default useAuth;
