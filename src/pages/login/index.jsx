import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@context";
import { ROUTES } from "@constants";
import { GoogleIcon, Logo } from "@statics";
import { firebaseService, loginService } from "@services";
import style from "./style.module.scss";

export function LoginPage() {
  const { user, loginAsGuest } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithGoogle } = loginService();
  const { auth, provider } = firebaseService();
  const redirectTo = location.state?.from?.pathname ?? ROUTES.HOME.pathname;

  async function handleLogin() {
    try {
      await loginWithGoogle(auth, provider);
      navigate(redirectTo);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao realizar o login.");
    }
  }

  function handleGuestLogin() {
    loginAsGuest();
    navigate(redirectTo);
  }

  function renderLoginPage() {
    return (
      <div className={style["container-page"]}>
        <div className={style["container-content"]}>
          <img className={style["image"]} src={Logo} />
          <span className={style["text"]}>
            Faça login e jogue com seus amigos
          </span>
          <button className={style["button"]} onClick={handleLogin}>
            <GoogleIcon /> Entrar com Google
          </button>
          <button className={style["button"]} onClick={handleGuestLogin}>
            Jogar como convidado
          </button>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (user) return <Navigate to={redirectTo} replace />;

    return renderLoginPage();
  }

  return renderContent();
}
