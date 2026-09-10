import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Board } from "@components";
import { ROOM_STATUS } from "@constants";
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

    if (!hasInitialRoom)
      enterRoom(user.uid, user.displayName, user.photoURL, code);
  }, []);

  function handleCellClick(position) {
    play(position);
  }

  function renderPlayersInformation() {
    return room?.players.map((player) => (
      <div key={player.playerId} className={style["container-player"]}>
        <img
          className={style["image"]}
          src={player.imageUrl}
          alt={`Imagem de ${player.name}`}
        />
        <span className={style["name"]}>{player.name}</span>
      </div>
    ));
  }

  function renderWaitingForOponent() {
    return (
      <>
        Aguardando oponente
        <div className={style["dot"]} />
        <div className={style["dot"]} />
        <div className={style["dot"]} />
      </>
    );
  }

  function renderFinishedMessage() {
    const currentPlayer = room?.players.find(
      (player) => player.playerId === user.uid,
    );
    const hasCurrentPlayerWon = room?.winner === currentPlayer?.symbol;

    if (hasCurrentPlayerWon) return "Você venceu!";

    return "Você perdeu!";
  }

  function renderTitle() {
    const isWaiting = room?.status === ROOM_STATUS.WAITING;
    const isPlaying = room?.status === ROOM_STATUS.PLAYING;
    const isFinished = room?.status === ROOM_STATUS.FINISHED;

    if (isWaiting) return renderWaitingForOponent();
    if (isPlaying) return "Oponente encontrado!";
    if (isFinished) return renderFinishedMessage();

    return renderWaitingForOponent();
  }

  function renderGameInformation() {
    return (
      <div className={style["container-information"]}>
        <span className={style["title"]}>{renderTitle()}</span>
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
