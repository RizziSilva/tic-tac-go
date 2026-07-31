import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@pages";
import "./style.scss";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
