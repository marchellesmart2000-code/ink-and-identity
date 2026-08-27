import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { MotionConfig } from "framer-motion";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function Root() {
  if (!convexClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-ivory">
        <div className="max-w-lg">
          <p className="eyebrow">Ink & Identity</p>
          <h1 className="display mt-4 text-5xl">Connect Convex to continue</h1>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">
            Add VITE_CONVEX_URL to your environment, then run the Convex development server. See the README for bootstrap, seed and Vercel deployment.
          </p>
        </div>
      </div>
    );
  }
  const client = convexClient;
  return (
    <ConvexAuthProvider client={client}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MotionConfig>
    </ConvexAuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
