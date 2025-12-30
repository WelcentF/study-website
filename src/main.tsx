import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import Timer from "./components/Timer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Timer />
  </StrictMode>
);
