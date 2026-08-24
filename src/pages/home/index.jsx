import { useEffect, useState } from "react";
import { Logo } from "@statics";
import { useAuth } from "@context";
import { userService } from "@services";
import { useAsyncRequest } from "@hooks";
import style from "./style.module.scss";
import toast from "react-hot-toast";

export function HomePage() {
  const [userGamesInfo, setUserGamesInfo] = useState({});
  const { user } = useAuth();
  const { getUserInfo } = userService();
  const { asyncRequest } = useAsyncRequest();

  useEffect(() => {
    async function getUserGamesInfo() {
      try {
        const data = await asyncRequest(() => getUserInfo(user.uid));

        setUserGamesInfo(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar as informações dos jogos do usuário.");
      }
    }

    getUserGamesInfo();
  }, []);

  function handleJoinMatchClick() {}

  function handleCreateMatchClick() {}

  function renderUserStatistics() {
    const { games, wins, defeats } = userGamesInfo;

    return (
      <div className={style["container-statistics"]}>
        <span className={`${style["text"]} ${style["games"]}`}>
          Jogos: <strong>{games}</strong>
        </span>
        <span className={`${style["text"]} ${style["wins"]}`}>
          Vitórias: <strong>{wins}</strong>
        </span>
        <span className={`${style["text"]} ${style["defeats"]}`}>
          Derrotas: <strong>{defeats}</strong>
        </span>
      </div>
    );
  }

  function renderActions() {
    return (
      <div className={style["container-actions"]}>
        <button onClick={handleCreateMatchClick} className={style["button"]}>
          Criar partida
        </button>
        <button onClick={handleJoinMatchClick} className={style["button"]}>
          Entrar em partida
        </button>
      </div>
    );
  }

  return (
    <div className={style["container-home-page"]}>
      <div className={style["container-content"]}>
        <img src={Logo} className={style["logo"]} />
        {renderUserStatistics()}
        {renderActions()}
      </div>
    </div>
  );
}
