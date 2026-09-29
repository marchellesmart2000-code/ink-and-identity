import { Button } from "@/components/ui/Button";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/categories", label: "Categories", admin: true },
  { to: "/admin/products", label: "Products", admin: true },
  { to: "/admin/featured", label: "Featured reel", admin: true },
  { to: "/admin/services", label: "Services", admin: true },
  { to: "/admin/social", label: "Social", admin: true },
  { to: "/admin/testimonials", label: "Testimonials", admin: true },
  { to: "/admin/settings", label: "Settings", admin: true },
  { to: "/admin/users", label: "Users", admin: true },
];

export function AdminLayout() {
  const me = useQuery(api.users.me);
  const { signOut } = useAuthActions();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  if (me === undefined && !slow) {
    return <div className="p-10 text-sm text-gold">Checking studio access…</div>;
  }
  if (me === undefined && slow) {
    return (
      <div className="mx-auto max-w-lg p-8 text-ivory">
        <h1 className="display text-4xl">Studio backend is offline</h1>
        <p className="mt-4 text-sm leading-relaxed text-ivory/70">
          The public catalogue still works. Sign-in needs the Convex studio server running on this machine.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/admin/login">Try sign in</Button>
          <Button href="/" variant="line">Back to the site</Button>
        </div>
      </div>
    );
  }
  if (me === null) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!me) {
    return null;
  }

  return (
    <div className="min-h-screen bg-warm md:grid md:grid-cols-[16rem_1fr]">
      <aside className="bg-ink p-4 text-ivory md:p-6">
        <p className="display text-3xl">Studio</p>
        <p className="mt-1 text-xs text-ivory/50">
          {me.name || me.email} · {me.role}
        </p>
        <nav className="mt-4 flex gap-4 overflow-x-auto pb-2 text-sm md:mt-8 md:flex-col md:overflow-visible md:pb-0" aria-label="Admin">
          {links
            .filter((link) => !link.admin || me.role === "admin")
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `shrink-0 ${isActive ? "text-gold" : "text-ivory/75 hover:text-gold"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>
        <div className="mt-10 space-y-3">
          <Button href="/" variant="ghost" className="w-full">
            View site
          </Button>
          <Button variant="line" className="w-full border-ivory/20 text-ivory" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </aside>
      <div className="p-4 md:p-10">
        <Outlet />
      </div>
    </div>
  );
}
