import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "~/styles/global.css";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { App } from "~/App";

// Create a new router instance
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
