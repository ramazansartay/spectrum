import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { i18nPromise } from "./i18n";
import { Suspense } from "react";

i18nPromise.then(() => {
  const container = document.getElementById("root");
  if (container) {
    if (container.hasChildNodes()) {
      hydrateRoot(
        container,
        <Suspense fallback={null}>
          <App />
        </Suspense>
      );
    } else {
      createRoot(container).render(
        <Suspense fallback={null}>
          <App />
        </Suspense>
      );
    }
  } else {
    console.error("Root container not found");
  }
});
