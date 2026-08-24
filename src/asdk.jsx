import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useLoading } from "@context";
import { HomePage, LoginPage } from "@pages";
import { ROUTES } from "@constants";
import { ProtectedRoute } from "@components";
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
          <Route
            path={ROUTES.HOME.pathname}
            element={
              <ProtectedRoute>
                <HomePage />
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
