import { Logo } from "@statics";
import style from "./style.module.scss";

export function Loader() {
  return (
    <div className={style["container-loader"]}>
      <div className={style["blur"]} />
      <img className={style["logo"]} src={Logo} alt="Loading" />
    </div>
  );
}
