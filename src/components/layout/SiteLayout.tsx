import { useLayoutEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Outlet, useLocation } from "react-router-dom";

export function SiteLayout() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-dvh bg-ink text-ivory">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" key={pathname} className="page-enter overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
