import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, MapPin } from "lucide-react";

export const Route = createFileRoute("/pdf")({
  head: () => ({
    meta: [
      { title: "PDF Maps | KS Big Real Estate" },
      {
        name: "description",
        content:
          "Download useful housing scheme PDF maps and area guides from KS Big Real Estate.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PdfMapsPage,
});

const mapGuides = [
  {
    title: "Housing Scheme Map Guide",
    text: "A convenient PDF reference for reviewing housing scheme layouts and locations.",
  },
  {
    title: "Area Planning Guide",
    text: "Use this guide when comparing nearby areas, access routes and planned development.",
  },
  {
    title: "Property Visit Checklist",
    text: "A simple printable checklist to take with you when viewing a plot or house.",
  },
];

function PdfMapsPage() {
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
          <span aria-current="page">PDF Maps</span>
        </nav>

        <p className="font-semibold uppercase tracking-widest text-primary">Helpful resources</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">PDF Maps & Guides</h1>
        <p className="mt-4 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
          Al-Kabeer Town Phase 2, Lahore
        </p>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          Browse useful PDF resources before planning a property visit or discussing your next
          investment with KS Big Real Estate.
        </p>

        <section aria-labelledby="pdf-guides-heading" className="mt-10">
          <h2 id="pdf-guides-heading" className="sr-only">
            PDF resources
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {mapGuides.map(({ title, text }) => (
              <li key={title} className="rounded-2xl border bg-card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-primary-foreground">
                  <FileText className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
                <Link
                  to="/"
                  hash="inquiry"
                  className="mt-5 inline-flex items-center gap-2 rounded font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Request this PDF <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="pdf-contact-heading"
          className="mt-10 rounded-2xl border bg-card px-6 py-12 text-center"
        >
          <h2 id="pdf-contact-heading" className="font-display text-2xl font-bold">
            Need a specific map?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Contact us with the housing scheme or area name, and we will help you find the right
            reference.
          </p>
          <Link
            to="/"
            hash="inquiry"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Ask about PDF maps <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </section>
      </main>
    </div>
  );
}
