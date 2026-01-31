
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import i18n from "./i18n";

const container = document.getElementById("root");

i18n.init().then(() => {
  if (container) {
    if (container.hasChildNodes()) {
      hydrateRoot(container, <App />);
    } else {
      createRoot(container).render(<App />);
    }
  } else {
    console.error("Root container not found");
  }
});
