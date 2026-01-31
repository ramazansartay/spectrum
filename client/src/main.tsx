import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n"; // Import to initialize
import { Suspense } from "react";
import Loading from "@/components/Loading";

const container = document.getElementById("root");

if (container) {
  const app = (
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  );

  if (container.hasChildNodes()) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
}
