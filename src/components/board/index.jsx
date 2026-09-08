import { CELLS_ARRAY } from "@constants";
import style from "./style.module.scss";

export function Board({ board = [], onCellClick }) {
  function handleCellClick(symbol, index) {
    if (!onCellClick) return;

    const isCellEmpty = !symbol;

    if (isCellEmpty) onCellClick(index);
  }

  function renderCells() {
    return CELLS_ARRAY.map((position, index) => {
      const symbol = board[index];

      return (
        <button
          key={position}
          className={`${style["cell"]} ${style[position]}`}
          onClick={() => handleCellClick(symbol, index)}
        >
          {symbol}
        </button>
      );
    });
  }

  return <div className={style["container-board"]}>{renderCells()}</div>;
}
