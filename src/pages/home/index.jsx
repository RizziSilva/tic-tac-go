import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Logo } from "@statics";
import { useAuth } from "@context";
import { ERRORS, ROUTES } from "@constants";
import { userService } from "@services";
import { useAsyncRequest, useGame } from "@hooks";
import { ROOM_CODE_LENGTH } from "./constants";
import style from "./style.module.scss";

export function HomePage() {
  const [userGamesInfo, setUserGamesInfo] = useState({});
  const [code, setCode] = useState("");
  const { user } = useAuth();
  const { getUserInfo } = userService();
  const { asyncRequest } = useAsyncRequest();
  const { createRoom, room, joinRoom, error } = useGame();
  const navigate = useNavigate();

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

    if (!user.isGuest) getUserGamesInfo();
  }, []);

  useEffect(() => {
    function handleRoom() {
      if (room)
        navigate(`${ROUTES.GAME.path}${room.code}`, { state: { room } });
    }

    handleRoom();
  }, [room]);

  useEffect(() => {
    const isRoomNotFound = error?.code === ERRORS.ROOM_NOT_FOUND;

    if (isRoomNotFound) toast.error("Sala não encontrada.");
    else if (error) toast.error("Erro ao entrar na partida.");
  }, [error]);

  function handleChange(event) {
    const { value } = event.target;

    setCode(value);
  }

  function handleJoinMatchClick() {
    joinRoom(user.uid, user.displayName, user.photoURL, code);
  }

  function handleCreateMatchClick() {
    createRoom(user.uid, user.displayName, user.photoURL, false);
  }

  function renderUserStatistics() {
    const { games = 0, wins = 0, defeats = 0 } = userGamesInfo;

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
    const isJoinWithCodeDisabled = code.length > ROOM_CODE_LENGTH;

    return (
      <div className={style["container-actions"]}>
        <button onClick={handleCreateMatchClick} className={style["button"]}>
          Criar partida
        </button>
        <input
          name="code"
          className={style["input"]}
          onChange={handleChange}
          value={code}
          placeholder="Código de 6 dígitos da Sala."
          maxLength={ROOM_CODE_LENGTH}
          disabled={isJoinWithCodeDisabled}
        />
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
