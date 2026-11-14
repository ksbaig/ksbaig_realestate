import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HardHat, MapPin, Ruler, PencilRuler, Paintbrush, Hammer } from "lucide-react";

export const Route = createFileRoute("/construction")({
  head: () => ({
    meta: [
      { title: "Construction Services | KS Big Real Estate" },
      {
        name: "description",
        content:
          "Residential and commercial construction, renovation, interior design and architectural services in Al-Kabeer Town Phase 2, Lahore.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConstructionPage,
});

const services = [
  {
    Icon: HardHat,
    title: "Residential Construction",
    text: "Grey structure to final finish for family homes, built to a clear plan and schedule.",
  },
  {
    Icon: Ruler,
    title: "Commercial Construction",
    text: "Shops, offices and commercial buildings planned for daily use and long-term value.",
  },
  {
    Icon: Hammer,
    title: "Renovation",
    text: "Upgrades and repairs for existing houses, from structure to finishing work.",
  },
  {
    Icon: Paintbrush,
    title: "Interior Design",
    text: "Layouts, finishes and fittings that suit how your family lives.",
  },
  {
    Icon: PencilRuler,
    title: "Architectural Design",
    text: "Concept, drawings and approvals before construction begins.",
  },
];

function ConstructionPage() {
  return (
    <div className="min-h-screen bg-soft font-sans">
      <header className="bg-deep text-deep-foreground">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold">
              KS
            </span>
            <span className="font-display text-lg font-bold sm:text-xl">KS Big Real Estate</span>
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
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ Icon, title, text }) => (
              <li key={title} className="rounded-2xl border bg-card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
              </li>
            ))}
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
    </div>
  );
}
