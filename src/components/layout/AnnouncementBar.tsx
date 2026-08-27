import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function AnnouncementBar() {
  const settings = useSiteSettings();
  if (!settings?.announcementEnabled || !settings.announcementText) {
    return null;
  }
  const inner = (
    <p className="px-3 py-2 text-center text-[0.62rem] leading-5 tracking-[0.12em] uppercase text-gold sm:tracking-[0.22em]">
      {settings.announcementText}
    </p>
  );
  return (
    <div className="border-b border-gold/25 bg-ink">
      {settings.announcementHref ? (
        <Link to={settings.announcementHref} className="block text-gold hover:text-gold-bright">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
