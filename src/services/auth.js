import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { firebaseService } from "@services";
import { ROUTES } from "@constants";

export function loginService() {
  const provider = new GoogleAuthProvider();
  const { auth } = firebaseService();
  const navigate = useNavigate();

  async function loginWithGoogle() {
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    await signOut(auth);

    navigate(ROUTES.LOGIN.pathname);
  }

  return { loginWithGoogle, logout };
}
