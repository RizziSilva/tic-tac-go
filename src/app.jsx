import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useLoading } from "@context";
import { GamePage, HomePage, LoginPage } from "@pages";
import { useSocket } from "@hooks";
import { ROUTES } from "@constants";
import { Loader, ProtectedRoute } from "@components";
import "./style.scss";

export default function App() {
  const { isLoading } = useLoading();
  useSocket();

  function renderLoader() {
    if (!isLoading) return null;

    return <Loader />;
  }

  return (
    <>
      <Toaster position="top-right" />
      {renderLoader()}
      <BrowserRouter>
        <Routes>
          <Route
            path={ROUTES.HOME.pathname}
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.GAME.pathname}
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.LOGIN.pathname} element={<LoginPage />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME.pathname} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
