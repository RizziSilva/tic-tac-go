import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLoading } from "@context";
import { HomePage, LoginPage } from "@pages";
import { ROUTES } from "@constants";
import "./style.scss";

export default function App() {
  const { isLoading } = useLoading();

  function renderLoader() {
    if (!isLoading) return null;

    return <Loader />;
  }

  return (
    <>
      {renderLoader()}
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME.pathname} element={<HomePage />} />
          <Route path={ROUTES.LOGIN.pathname} element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
