import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cn } from "@/lib/cn";
import { resolveStudio } from "@/lib/studio";
import { CONTACT_WHATSAPP_MESSAGE, whatsappHref } from "@/lib/whatsapp";

export function SocialLinks({ className }: { className?: string }) {
  const studio = resolveStudio(useSiteSettings());
  const whatsapp = whatsappHref(studio.whatsapp, CONTACT_WHATSAPP_MESSAGE);
  const links = [
    studio.instagramUrl
      ? { href: studio.instagramUrl, label: "Instagram", icon: <InstagramIcon /> }
      : null,
    studio.facebookUrl
      ? { href: studio.facebookUrl, label: "Facebook", icon: <FacebookIcon /> }
      : null,
    whatsapp ? { href: whatsapp, label: "WhatsApp", icon: <WhatsAppIcon /> } : null,
  ].filter((link) => link !== null);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          target="_blank"
          rel="noreferrer"
          className="inline-flex size-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:border-gold hover:bg-gold/10"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h2.6l.4-3H14V9.5c0-.3.2-.5.5-.5H14z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
      <path d="M12.04 3C7.31 3 3.5 6.7 3.5 11.3c0 1.46.4 2.88 1.16 4.13L3.4 21l5.72-1.22a8.7 8.7 0 0 0 2.92.5c4.73 0 8.54-3.7 8.54-8.3S16.77 3 12.04 3zm4.86 11.72c-.2.56-1.16 1.07-1.62 1.14-.42.06-.96.09-1.55-.1-.36-.11-.82-.26-1.41-.51-2.48-1.07-4.1-3.57-4.22-3.74-.12-.17-1-1.33-1-2.54 0-1.2.63-1.8.86-2.04.22-.24.49-.3.65-.3h.47c.15 0 .35-.06.55.42.2.5.7 1.72.76 1.84.06.12.1.27.02.43-.08.17-.12.27-.24.41-.12.15-.25.32-.36.43-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.66.92.82 1.69 1.07 1.93 1.19.24.12.38.1.52-.06.14-.17.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14z" />
    </svg>
  );
}
