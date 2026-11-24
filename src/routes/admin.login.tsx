import { FormEvent, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { authenticateAdmin, isAdminConfigured } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | KSBaig Real Estate" },
      { name: "description", content: "Secure administrator login for KSBaig Real Estate." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isAdminConfigured()) {
      setError(
        "Administrator login is not configured. Set the VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD environment variables.",
      );
      return;
    }

    if (!authenticateAdmin(username.trim(), password)) {
      setError("The administrator username or password is incorrect.");
      return;
    }

    void navigate({ to: "/" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-soft px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-glow">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>

        <div className="mt-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-primary-foreground">
            <ShieldCheck className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold">Administrator login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage KSBaig Real Estate listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-username" className="text-sm font-semibold">
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-sm font-semibold">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <LockKeyhole className="h-4 w-4" /> Sign in as administrator
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This area is restricted to authorized administrators.
        </p>
      </div>
    </main>
  );
}
