import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { i18nPromise } from "./i18n";
import { Suspense } from "react";

i18nPromise
  .then(() => {
    const container = document.getElementById("root");
    if (container) {
      const app = (
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      );
      if (container.hasChildNodes()) {
        hydrateRoot(container, app);
      } else {
        createRoot(container).render(app);
      }
    }
  })
  .catch((err) => {
    console.error("i18n initialization failed", err);
    const container = document.getElementById("root");
    if (container) {
      container.innerHTML = "Application failed to load. Please try again later.";
    }
  });