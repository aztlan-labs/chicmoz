import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "~/styles/global.css";
import { QueryProvider, TanstackRouterProvider } from "./providers";

// NOTE: these two lines are necessary for proper parsing of ChicmozL2Block
import { Buffer } from "buffer";
import { Toaster } from "./components/ui/sonner";
window.Buffer = window.Buffer || Buffer;

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryProvider>
        <TanstackRouterProvider />
        <Toaster />
      </QueryProvider>
    </StrictMode>,
  );
}
