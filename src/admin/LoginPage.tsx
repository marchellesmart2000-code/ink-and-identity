import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export function LoginPage() {
  const me = useQuery(api.users.me);
  const hasAdmin = useQuery(api.users.hasAnyAdmin);
  const { signIn } = useAuthActions();
  const bootstrap = useAction(api.users.bootstrapAdmin);
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<"login" | "bootstrap">("login");

  if (me) {
    return <Navigate to="/admin" replace />;
  }

  async function onLogin(event: React.FormEvent) {
    event.preventDefault();
    try {
      const result = await signIn("password", { email, password, flow: "signIn" });
      if (result.signingIn === false) {
        push("Those details did not match a studio account.", "error");
      }
    } catch {
      push("Those details did not match a studio account.", "error");
    }
  }

  async function onBootstrap(event: React.FormEvent) {
    event.preventDefault();
    try {
      await bootstrap({ email, password, name, token });
      await signIn("password", { email, password, flow: "signIn" });
    } catch (error) {
      push(error instanceof Error ? error.message : "Bootstrap failed.", "error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink paper-grain px-4 text-ivory">
      <div className="w-full max-w-md rounded-sm border border-gold/25 bg-charcoal p-8">
        <p className="eyebrow">Ink & Identity</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Studio</h1>
        <form className="mt-8 space-y-4" onSubmit={mode === "login" ? onLogin : onBootstrap}>
          {mode === "bootstrap" ? (
            <>
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Bootstrap token" value={token} onChange={(e) => setToken(e.target.value)} />
            </>
          ) : null}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">
            {mode === "login" ? "Sign in" : "Create first admin"}
          </Button>
        </form>
        {hasAdmin === false ? (
          <button
            type="button"
            className="mt-6 text-sm text-gold"
            onClick={() => setMode(mode === "login" ? "bootstrap" : "login")}
          >
            {mode === "login" ? "First-admin bootstrap" : "Back to sign in"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
