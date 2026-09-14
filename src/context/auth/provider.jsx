import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseService, userService } from "@services";
import { AuthContext } from "./context";
import { GUEST_STORAGE_KEY } from "./constants";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const { auth } = firebaseService();
  const { saveUserIfNotExists } = userService();

  useEffect(() => {
    function handleGuestUser() {
      const storedGuest = sessionStorage.getItem(GUEST_STORAGE_KEY);
      const hasStoredGuest = !!storedGuest;

      if (hasStoredGuest) setUser(JSON.parse(storedGuest));
    }

    async function handleLogin(user) {
      const isGuestSessionActive =
        !user && sessionStorage.getItem(GUEST_STORAGE_KEY);

      if (user) {
        await saveUserIfNotExists(user);
        setUser(user);
      } else if (!isGuestSessionActive) setUser(null);
    }

    handleGuestUser();
    const unsub = onAuthStateChanged(auth, handleLogin);
    return unsub;
  }, []);

  function loginAsGuest() {
    const guestId = crypto.randomUUID();
    const guestUser = {
      uid: guestId,
      displayName: "Convidado",
      photoURL: null,
      isGuest: true,
    };

    sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    setUser(guestUser);
  }

  return (
    <AuthContext.Provider value={{ user, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}
