import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Board, Modal } from "@components";
import { ROOM_STATUS, ROUTES } from "@constants";
import { useAuth } from "@context";
import { useGame } from "@hooks";
import { userService } from "@services";
import { DefaultUser, LeftArrow } from "@statics";
import style from "./style.module.scss";

export function GamePage() {
  const [isGiveUpModalOpen, setIsGiveUpModalOpen] = useState(false);
  const hasUpdatedGameResult = useRef(false);
  const location = useLocation();
  const initialRoom = location.state?.room;
  const {
    room,
    enterRoom,
    play,
    leaveRoom,
    requestRematch,
    isOpponentDisconnected,
  } = useGame(initialRoom ?? null);
  const { code } = useParams();
  const { user } = useAuth();
  const { updateGameResult } = userService();
  const navigate = useNavigate();
  const opponent = room?.players.find((player) => player.playerId !== user.uid);
  const hasOpponentRequestedRematch = room?.rematchRequests?.includes(
    opponent?.playerId,
  );

  useEffect(() => {
    const hasInitialRoom = initialRoom;

    if (!hasInitialRoom)
      enterRoom(user.uid, user.displayName, user.photoURL, code);
  }, []);

  useEffect(() => {
    function handleUserGamesUpdate() {
      const isFinished = room?.status === ROOM_STATUS.FINISHED;
      const shouldUpdateUserGames = isFinished && !hasUpdatedGameResult.current;

      if (shouldUpdateUserGames) {
        const currentPlayer = room?.players.find(
          (player) => player.playerId === user.uid,
        );
        const hasCurrentPlayerWon = room?.winner === currentPlayer?.symbol;

        hasUpdatedGameResult.current = true;
        if (!user.isGuest) updateGameResult(user.uid, hasCurrentPlayerWon);
      }
    }

    function handleRematchStarted() {
      const isPlaying = room?.status === ROOM_STATUS.PLAYING;

      if (isPlaying) hasUpdatedGameResult.current = false;
    }

    handleUserGamesUpdate();
    handleRematchStarted();
  }, [room]);

  useEffect(() => {
    function handleRematchToaster() {
      if (hasOpponentRequestedRematch)
        toast(`${opponent?.name} quer jogar novamente!`, {
          style: {
            border: "1px solid gray",
          },
        });
    }

    handleRematchToaster();
  }, [hasOpponentRequestedRematch]);

  function handleCellClick(position) {
    play(position);
  }

  function handleBackClick() {
    const hasOpponent = room?.players.length === 2;
    const isGameInProgress = room?.status === ROOM_STATUS.PLAYING;
    const isGivingUp = hasOpponent && isGameInProgress;

    if (isGivingUp) setIsGiveUpModalOpen(true);
    else {
      leaveRoom(user.uid);
      navigate(ROUTES.HOME.pathname);
    }
  }

  function handleGiveUpConfirm() {
    hasUpdatedGameResult.current = true;
    if (!user.isGuest) updateGameResult(user.uid, false);
    leaveRoom(user.uid);
    navigate(ROUTES.HOME.pathname);
  }

  function handleGiveUpCancel() {
    setIsGiveUpModalOpen(false);
  }

  function handleRematchClick() {
    requestRematch(user.uid);
  }

  function renderPlayersInformation() {
    return room?.players.map((player) => (
      <div key={player.playerId} className={style["container-player"]}>
        <img
          className={style["image"]}
          src={player.imageUrl || DefaultUser}
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

  function renderOpponentReconnecting() {
    return (
      <>
        Oponente reconectando
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

    if (isOpponentDisconnected) return renderOpponentReconnecting();
    if (isWaiting) return renderWaitingForOponent();
    if (isPlaying) return "Oponente encontrado!";
    if (isFinished) return renderFinishedMessage();

    return renderWaitingForOponent();
  }

  function renderRematchButton() {
    const isFinished = room?.status === ROOM_STATUS.FINISHED;

    if (!isFinished) return null;

    const hasRequestedRematch = room?.rematchRequests?.includes(user.uid);

    if (hasRequestedRematch)
      return (
        <span className={style["rematch-waiting"]}>
          Aguardando oponente para revanche
        </span>
      );

    return (
      <button className={style["button-rematch"]} onClick={handleRematchClick}>
        Jogar novamente
      </button>
    );
  }

  function renderGameInformation() {
    return (
      <div className={style["container-information"]}>
        <span className={style["title"]}>{renderTitle()}</span>
        {renderPlayersInformation()}
        {renderRematchButton()}
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isGiveUpModalOpen}
        message="Tem certeza que deseja desistir da partida?"
        confirmLabel="Desistir"
        cancelLabel="Cancelar"
        onConfirm={handleGiveUpConfirm}
        onCancel={handleGiveUpCancel}
      />
      <div className={style["container-page"]}>
        <button className={style["button-back"]} onClick={handleBackClick}>
          <LeftArrow />
        </button>
        {renderGameInformation()}
        <div className={style["container-board"]}>
          <Board board={room?.board} onCellClick={handleCellClick} />
        </div>
      </div>
    </>
  );
}
