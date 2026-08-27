import { Button } from "@/components/ui/Button";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { NavLink, Navigate, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/quotes", label: "Quotes" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/journal", label: "Journal" },
  { to: "/admin/campaigns", label: "Campaigns" },
  { to: "/admin/social", label: "Social" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/settings", label: "Settings", admin: true },
  { to: "/admin/users", label: "Users", admin: true },
];

export function AdminLayout() {
  const me = useQuery(api.users.me);
  const { signOut } = useAuthActions();

  if (me === undefined) {
    return <div className="p-10 text-sm text-gold">Checking studio access…</div>;
  }
  if (me === null) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-warm md:grid md:grid-cols-[16rem_1fr]">
      <aside className="bg-ink p-6 text-ivory">
        <p className="display text-3xl">Studio</p>
        <p className="mt-1 text-xs text-ivory/50">
          {me.name || me.email} · {me.role}
        </p>
        <nav className="mt-8 flex flex-col gap-3 text-sm" aria-label="Admin">
          {links
            .filter((link) => !link.admin || me.role === "admin")
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "text-gold" : "text-ivory/75 hover:text-gold")}
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
      <div className="p-6 md:p-10">
        <Outlet />
      </div>
    </div>
  );
}
