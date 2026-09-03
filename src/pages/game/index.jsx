import { useLocation, useParams } from "react-router-dom";
import { Board } from "@components";
import style from "./style.module.scss";

export function GamePage() {
  const { code } = useParams();
  const location = useLocation();
  const initialRoom = location.state?.room;

  return (
    <div className={style["container-page"]}>
      <Board />
    </div>
  );
}