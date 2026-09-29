import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MobileNav } from "./MobileNav";

const links = [
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const settings = useSiteSettings();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = location.pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b text-ivory transition-colors pt-[env(safe-area-inset-top)]",
        overHero
          ? "border-gold/15 bg-ink/20"
          : "border-gold/25 bg-ink/95 shadow-[0_1px_0_rgb(198_163_90/0.18)]",
        open ? "backdrop-blur-none" : overHero ? "backdrop-blur-sm" : "backdrop-blur",
      )}
    >
      <div className="container-wide flex items-center justify-between gap-3 py-3 md:py-4">
        <Link to="/" className="display min-w-0 truncate text-xl tracking-tight text-gold sm:text-2xl md:text-3xl">
          {settings?.brandName ?? "Ink & Identity"}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-[0.72rem] tracking-[0.16em] uppercase text-ivory/75",
                  isActive ? "text-gold" : "hover:text-gold",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <SocialLinks />
          <Button href="/services" variant="ghost">
            Explore services
          </Button>
          <Button href="/quote" variant="gold">
            Request a quote
          </Button>
        </div>
        <IconButton
          label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="relative text-gold lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </IconButton>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} links={links} />
    </header>
  );
}
