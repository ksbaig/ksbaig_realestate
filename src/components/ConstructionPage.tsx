import { Link } from "@tanstack/react-router";
import { ArrowRight, HardHat, MapPin, Ruler, PencilRuler, Paintbrush, Hammer } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { CardAdminControls } from "@/components/CardAdminControls";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useManagedCards } from "@/hooks/useManagedCards";
import { useAdminAuthenticated } from "@/lib/admin-auth";

const serviceIcons = {
  residential: HardHat,
  commercial: Ruler,
  renovation: Hammer,
  interior: Paintbrush,
  architectural: PencilRuler,
};

type Service = {
  id: keyof typeof serviceIcons;
  title: string;
  text: string;
  hidden?: boolean;
};

const services: Service[] = [
  {
    id: "residential",
    title: "Residential Construction",
    text: "Grey structure to final finish for family homes, built to a clear plan and schedule.",
  },
  {
    id: "commercial",
    title: "Commercial Construction",
    text: "Shops, offices and commercial buildings planned for daily use and long-term value.",
  },
  {
    id: "renovation",
    title: "Renovation",
    text: "Upgrades and repairs for existing houses, from structure to finishing work.",
  },
  {
    id: "interior",
    title: "Interior Design",
    text: "Layouts, finishes and fittings that suit how your family lives.",
  },
  {
    id: "architectural",
    title: "Architectural Design",
    text: "Concept, drawings and approvals before construction begins.",
  },
];

export function ConstructionPage() {
  const isAdmin = useAdminAuthenticated();
  const [editing, setEditing] = useState<Service | null>(null);
  const [formError, setFormError] = useState("");
  const { cards, loaded, error, saveCard, deleteCard, toggleVisibility } = useManagedCards(
    services,
    "ksbaig_construction_changes",
    "construction services",
  );

  useEffect(() => {
    if (!isAdmin) setEditing(null);
  }, [isAdmin]);

  function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const text = String(data.get("description") ?? "").trim();
    if (!title || !text) {
      setFormError("Enter a title and description.");
      return;
    }
    try {
      saveCard({ ...editing, title, text });
      setEditing(null);
      setFormError("");
    } catch (saveError) {
      console.error("Could not save construction service:", saveError);
      setFormError("Could not save the service. Check your admin session and browser storage.");
    }
  }

  return (
    <div className="min-h-screen bg-soft font-sans">
      <header className="bg-deep text-deep-foreground">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold">
              KSB
            </span>
            <span className="font-display text-lg font-bold sm:text-xl">KSBaig Real Estate</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link
            to="/"
            className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Construction</span>
        </nav>

        <p className="font-semibold uppercase tracking-widest text-primary">You dream, we build</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Construction Services</h1>
        <p className="mt-4 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
          Al-Kabeer Town Phase 2, Lahore
        </p>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          From architectural design to final finishing, our team plans every detail for quality,
          durability and your vision. Tell us about your project and we will guide you through the
          next steps.
        </p>

        <section aria-labelledby="construction-services-heading" className="mt-10">
          <h2 id="construction-services-heading" className="sr-only">
            Our construction services
          </h2>
          {error && <p role="alert" className="mb-4 text-destructive">{error}</p>}
          {!loaded && !error && <p role="status">Loading construction services...</p>}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.filter((service) => isAdmin || !service.hidden).map((service) => {
              const Icon = serviceIcons[service.id];
              return (
              <li key={service.id} className="rounded-2xl border bg-card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                <p className="mt-2 text-muted-foreground">{service.text}</p>
                {isAdmin && service.hidden && (
                  <p className="mt-3 text-sm font-semibold text-destructive">Hidden from public</p>
                )}
                {isAdmin && (
                  <CardAdminControls
                    title={service.title}
                    hidden={service.hidden}
                    onEdit={() => { setFormError(""); setEditing(service); }}
                    onDelete={() => deleteCard(service)}
                    onToggleVisibility={() => toggleVisibility(service)}
                  />
                )}
              </li>
              );
            })}
          </ul>
        </section>

        <section
          aria-labelledby="construction-cta-heading"
          className="mt-10 rounded-2xl border bg-card px-6 py-12 text-center"
        >
          <h2 id="construction-cta-heading" className="font-display text-2xl font-bold">
            Schedule your free consultation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Share your plot size, budget and timeline, and our team will contact you.
          </p>
          <Link
            to="/"
            hash="inquiry"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Request a consultation <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </section>
      </main>
      <AlertDialog open={isAdmin && editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Construction Service</AlertDialogTitle>
            <AlertDialogDescription>Update this service in this browser.</AlertDialogDescription>
          </AlertDialogHeader>
          {editing && (
            <form key={editing.id} onSubmit={handleEdit} className="space-y-4">
              <div>
                <label htmlFor="service-title" className="block text-sm font-semibold">Service title</label>
                <input id="service-title" name="title" defaultValue={editing.title} required className="mt-2 w-full rounded-md border bg-background px-3 py-2" />
              </div>
              <div>
                <label htmlFor="service-description" className="block text-sm font-semibold">Description</label>
                <textarea id="service-description" name="description" defaultValue={editing.text} required rows={4} className="mt-2 w-full rounded-md border bg-background px-3 py-2" />
              </div>
              {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-md border px-4 py-2 font-semibold">Cancel</button>
                <button type="submit" className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">Save changes</button>
              </div>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
