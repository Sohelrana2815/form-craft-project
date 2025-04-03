import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainRoutes from "../src/routes/MainRoutes";
import { BrowserRouter } from "react-router";
import AuthProvider from "./providers/AuthProvider";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
