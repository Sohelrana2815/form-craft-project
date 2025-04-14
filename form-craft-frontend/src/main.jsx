import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainRoutes from "../src/routes/MainRoutes";
import { BrowserRouter } from "react-router";
import AuthProvider from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./providers/ThemeProvider";

// Create a client

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* Provide the client to your app */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <MainRoutes />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
