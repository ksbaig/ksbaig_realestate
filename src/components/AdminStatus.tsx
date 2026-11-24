import { LogOut, ShieldCheck } from "lucide-react";
import { logoutAdmin, useAdminAuthenticated } from "@/lib/admin-auth";

export function AdminStatus() {
  const isAdmin = useAdminAuthenticated();

  if (!isAdmin) return null;

  return (
    <div className="bg-deep px-6 py-2">
      <div className="mx-auto flex max-w-6xl justify-end">
        <button
          type="button"
          onClick={logoutAdmin}
          aria-label="Admin logged in. Log out"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Admin Logged In
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
