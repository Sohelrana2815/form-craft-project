import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainRoutes from "../src/routes/MainRoutes";
import { BrowserRouter } from "react-router";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </StrictMode>
);
