import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Link } from "react-router-dom";

export function MobileNav({
  open,
  onClose,
  links,
  whatsapp,
}: {
  open: boolean;
  onClose: () => void;
  links: Array<{ to: string; label: string }>;
  whatsapp: string | null;
}) {
  return (
    <Drawer open={open} title="Menu" onClose={onClose}>
      <nav className="flex flex-col gap-5" aria-label="Mobile">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="display text-4xl text-ivory"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-10 flex flex-col gap-3">
        <Button href="/services" variant="ghost" className="w-full" onClick={onClose}>
          Explore services
        </Button>
        <Button href="/quote" className="w-full">
          Request a quote
        </Button>
        {whatsapp ? (
          <Button href={whatsapp} variant="ghost" className="w-full">
            WhatsApp
          </Button>
        ) : null}
      </div>
    </Drawer>
  );
}
