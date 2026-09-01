import { useLocation, useParams } from "react-router-dom";
import style from "./style.module.scss";

export function GamePage() {
  const { code } = useParams();
  const location = useLocation();
  const initialRoom = location.state?.room;
  console.log("teste");
  return <div className={style["container-page"]}>Jogo</div>;
}
