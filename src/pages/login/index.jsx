import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@context";
import { ROUTES } from "@constants";
import { GoogleIcon, Logo } from "@statics";
import { firebaseService, loginService } from "@services";
import style from "./style.module.scss";

export function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loginWithGoogle } = loginService();
  const { auth, provider } = firebaseService();

  async function handleLogin() {
    try {
      await loginWithGoogle(auth, provider);
      navigate(ROUTES.DASHBOARD.pathname);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar informações sobre os bolões.");
    }
  }

  function renderLoginPage() {
    return (
      <div className={style["container-page"]}>
        <div className={style["container-content"]}>
          <img className={style["image"]} src={Logo} />
          <span className={style["text"]}>
            Faça login e jogo com seus amigos
          </span>
          <button className={style["button"]} onClick={handleLogin}>
            <GoogleIcon /> Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (user) return <Navigate to={ROUTES.HOME.pathname} replace />;

    return renderLoginPage();
  }

  return renderContent();
}
