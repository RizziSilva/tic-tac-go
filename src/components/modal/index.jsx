import style from "./style.module.scss";

export function Modal({
  isOpen,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) {
  function renderCancelButton() {
    if (!onCancel) return null;

    return (
      <button className={style["button-cancel"]} onClick={onCancel}>
        {cancelLabel}
      </button>
    );
  }

  function renderContent() {
    if (!isOpen) return null;

    return (
      <div className={style["container-modal"]}>
        <div className={style["blur"]} />
        <div className={style["content"]}>
          <span className={style["message"]}>{message}</span>
          <div className={style["container-buttons"]}>
            {renderCancelButton()}
            <button className={style["button-confirm"]} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return renderContent();
}
