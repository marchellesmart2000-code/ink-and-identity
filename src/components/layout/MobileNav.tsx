import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Link } from "react-router-dom";
import { SocialLinks } from "./SocialLinks";

export function MobileNav({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: Array<{ to: string; label: string }>;
}) {
  return (
    <Drawer open={open} title="Menu" onClose={onClose}>
      <nav className="flex flex-col" aria-label="Mobile">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="display block border-b border-gold/15 py-3.5 text-[1.75rem] leading-none text-ivory hover:text-gold sm:text-3xl"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3 pt-8 pb-2">
        <Button href="/services" variant="ghost" className="w-full" onClick={onClose}>
          Explore services
        </Button>
        <Button href="/quote" className="w-full" onClick={onClose}>
          Request a quote
        </Button>
        <SocialLinks />
      </div>
    </Drawer>
  );
}
