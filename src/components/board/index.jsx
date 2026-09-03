import { CELLS_ARRAY } from "@constants";
import style from "./style.module.scss";

export function Board() {
  function renderCells() {
    return CELLS_ARRAY.map((position, index) => (
      <div key={position} className={`${style["cell"]} ${style[position]}`} />
    ));
  }

  return <div className={style["container-board"]}>{renderCells()}</div>;
}
