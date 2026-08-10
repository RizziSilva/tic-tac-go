import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseService, UserService } from "@services";
import { AuthContext } from "./context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const { auth } = firebaseService();
  const { saveUserIfNotExists } = UserService();

  useEffect(() => {
    async function handleLogin(user) {
      if (user) {
        await saveUserIfNotExists(user);
        setUser(user);
      } else setUser(null);
    }

    const unsub = onAuthStateChanged(auth, handleLogin);
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
