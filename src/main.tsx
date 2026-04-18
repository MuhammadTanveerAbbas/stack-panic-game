import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Environment validation
const REQUIRED_VARS = ["VITE_GROQ_API_KEY"];
REQUIRED_VARS.forEach((key) => {
  if (!import.meta.env[key]) {
    console.warn(`[Config] Environment variable ${key} is missing. AI features will be disabled.`);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
