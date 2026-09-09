import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Board } from "@components";
import { useAuth } from "@context";
import { useGame } from "@hooks";
import style from "./style.module.scss";

export function GamePage() {
  const location = useLocation();
  const initialRoom = location.state?.room;
  const { room, enterRoom, play } = useGame(initialRoom ?? null);
  const { code } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const hasInitialRoom = initialRoom;

    if (!hasInitialRoom) enterRoom(user.uid, code);
  }, []);

  function handleCellClick(position) {
    play(position);
  }

  function renderPlayersInformation() {
    return room?.players.map(() => (
      <div className={style["container-player"]}>
        <img className={style["image"]} src="" alt="Imagem do usuário" />
        <span className={style["name"]}>Nome Qualquer</span>
      </div>
    ));
  }

  function renderGameInformation() {
    return (
      <div className={style["container-information"]}>
        <span className={style["title"]}>
          Aguardando oponente
          <div className={style["dot"]} />
          <div className={style["dot"]} />
          <div className={style["dot"]} />
        </span>
        {renderPlayersInformation()}
      </div>
    );
  }

  return (
    <div className={style["container-page"]}>
      {renderGameInformation()}
      <div className={style["container-board"]}>
        <Board board={room?.board} onCellClick={handleCellClick} />
      </div>
    </div>
  );
}
