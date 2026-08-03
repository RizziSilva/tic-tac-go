import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseService, userService } from "@services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const { auth } = firebaseService();
  //   const { saveUserIfNotExists } = userService();

  // TODO silva.william 03/08/26: Criar a implementação para a criação do usuário.
  useEffect(() => {
    async function handleLogin(user) {
      if (user) {
        // await saveUserIfNotExists(user);
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

export const useAuth = () => useContext(AuthContext);
