import style from "./style.module.scss";

const CELLS = Array(9).fill(null);

export function Board() {
  function renderCell(_, index) {
    return <div key={index} className={style["cell"]} />;
  }

  return (
    <div className={style["container-board"]}>{CELLS.map(renderCell)}</div>
  );
}