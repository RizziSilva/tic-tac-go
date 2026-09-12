import style from "./style.module.scss";

export function Modal({
  isOpen,
  message,
  confirmLabel = "Confirmar",
  onConfirm,
}) {
  function renderContent() {
    if (!isOpen) return null;

    return (
      <div className={style["container-modal"]}>
        <div className={style["blur"]} />
        <div className={style["content"]}>
          <span className={style["message"]}>{message}</span>
          <button className={style["button-confirm"]} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    );
  }

  return renderContent();
}
