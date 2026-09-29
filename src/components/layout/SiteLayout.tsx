import { Footer } from "./Footer";
import { Header } from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export function SiteLayout() {
  const location = useLocation();
  return (
    <div className="min-h-dvh bg-ink text-ivory">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          key={location.pathname}
          className="overflow-x-clip"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
