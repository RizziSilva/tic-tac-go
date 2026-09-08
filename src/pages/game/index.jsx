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

  return (
    <div className={style["container-page"]}>
      <Board board={room?.board} onCellClick={handleCellClick} />
    </div>
  );
}
