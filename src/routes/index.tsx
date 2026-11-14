import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { InquiryForm } from "@/components/InquiryForm";
const LazyVoiceAgent = lazy(() => import("@/components/VoiceAgent").then((m) => ({ default: m.VoiceAgent })));
const VoiceAgent = () => (
  <Suspense fallback={<div className="h-72 rounded-3xl bg-deep" />}>
    <LazyVoiceAgent />
  </Suspense>
);
import {
  Home, KeyRound, LandPlot, Building2, HardHat, Ruler, Files, FileText, Mic, MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, BadgeCheck,
} from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KS Big Real Estate | Al-Kabeer Town Phase 2, Lahore" },
      { name: "description", content: "Buy, sell & rent houses, 2/3/5 marla plots, commercial land and file merging in Al-Kabeer Town Phase 2, Lahore." },
      { property: "og:title", content: "KS Big Real Estate — Al-Kabeer Town Phase 2" },
      { property: "og:description", content: "Houses, plots, commercial land, rentals and file merging in Lahore." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const XIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}><path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-7-6.2 7H1.7l8-9.2L1.2 2h7l4.9 6.4L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" /></svg>
);
const TikTokIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}><path d="M16.6 2c.4 2.6 1.9 4.2 4.4 4.4v3.2c-1.6.1-3-.4-4.4-1.2v6.4c0 7.4-8.1 9.7-11.3 4.4-2.1-3.4-.8-9.4 5.9-9.6v3.4c-.5.1-1.1.2-1.6.4-1.5.5-2.4 1.4-2.1 3.1.5 3.2 6.3 4.1 5.8-2.1V2h3.3Z" /></svg>
);

const socials = [
  { name: "Facebook", Icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", Icon: Instagram, href: "https://instagram.com" },
  { name: "X", Icon: XIcon, href: "https://x.com" },
  { name: "YouTube", Icon: Youtube, href: "https://youtube.com" },
  { name: "TikTok", Icon: TikTokIcon, href: "https://tiktok.com" },
];

const services = [
  { Icon: Home, title: "Houses for Sale", text: "Ready-to-move homes across Al-Kabeer Town.", to: "/sale" as const },
  { Icon: KeyRound, title: "Buy a Property", text: "We find the right house at the right price." },
  { Icon: Building2, title: "Rented Houses", text: "Explore rental options for families.", to: "/rent" as const },
  { Icon: LandPlot, title: "Open Land", text: "Plots without construction, ready to build." },
  { Icon: Ruler, title: "Commercial", text: "Shops & commercial plots on main boulevards." },
  { Icon: Files, title: "File Merging", text: "Merge files of Al-Kabeer Phase 2 & any project." },
  { Icon: HardHat, title: "Construction", text: "Residential and commercial construction in Lahore.", to: "/construction" as const },
  { Icon: FileText, title: "PDF Maps", text: "Download useful housing scheme maps and area guides.", to: "/pdf" as const },
];

const plots = [
  { size: "2 Marla", note: "Compact & affordable" },
  { size: "3 Marla", note: "Perfect family start" },
  { size: "5 Marla", note: "Most popular choice" },
  { size: "Commercial", note: "Business opportunity" },
];

function Index() {
  return (
    <div className="font-sans">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-2 text-deep-foreground">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold">KS</span>
            <span className="font-display text-xl font-bold">KS Big Real Estate</span>
          </a>
          <div className="flex items-center gap-5">
            <nav className="hidden gap-8 text-sm font-medium text-deep-foreground/90 md:flex">
              <a href="#services" className="hover:text-accent">Services</a>
              <a href="#plots" className="hover:text-accent">Plots</a>
              <a href="#agent" className="hover:text-accent">AI Agent</a>
              <a href="#contact" className="hover:text-accent">Contact</a>
            </nav>
            <Link
              to="/pdf"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-glow transition hover:scale-105"
            >
              PDF Maps
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-[92vh] overflow-hidden">
        <img src={hero} alt="Al-Kabeer Town homes" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-overlay" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-6 pt-24 text-deep-foreground">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-deep-foreground/30 px-4 py-1.5 text-sm">
            <MapPin className="h-4 w-4 text-accent" /> Al-Kabeer Town Phase 2, Lahore
          </span>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-tight md:text-7xl">
            Your trusted partner for <span className="text-accent">homes & plots</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-deep-foreground/85">
            Sale, purchase and rentals of houses, 2, 3 & 5 marla plots, commercial land and file merging — all under one roof.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground shadow-glow transition hover:scale-105">
              Contact Us <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#agent" className="inline-flex items-center gap-2 rounded-full border border-deep-foreground/40 px-7 py-3.5 font-semibold transition hover:bg-deep-foreground/10">
              <Mic className="h-4 w-4" /> Talk to AI Agent
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="bg-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-semibold uppercase tracking-widest text-primary">What we offer</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Complete real estate services</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ Icon, title, text, to }) => (
              <div key={title} className="group relative rounded-2xl border bg-card p-7 transition hover:-translate-y-1 hover:shadow-glow">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-primary-foreground"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-bold">
                  {to ? (
                    <Link to={to} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring">
                      {title}
                    </Link>
                  ) : title}
                </h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
                {to && (
                  <Link
                    to={to}
                    className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Open {title} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plots" className="bg-brand py-24 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Plots & land available</h2>
          <p className="mt-3 max-w-xl text-primary-foreground/85">Land without construction and commercial plots in Al-Kabeer Town Phase 2.</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {plots.map((p) => (
              <div key={p.size} className="rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 p-7 backdrop-blur">
                <p className="font-display text-4xl font-bold">{p.size}</p>
                <p className="mt-2 text-primary-foreground/80">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agent" className="py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-widest text-primary">24/7 Assistant</p>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Speak with our <span className="text-brand">AI voice agent</span></h2>
            <p className="mt-4 text-lg text-muted-foreground">Ask about available houses, plot prices, rentals or file merging — in Urdu or English, any time.</p>
          </div>
          <ClientOnly fallback={<div className="h-72 rounded-3xl bg-deep" />}>
            <VoiceAgent />
          </ClientOnly>
        </div>
      </section>

      <section id="inquiry" className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center font-semibold uppercase tracking-widest text-primary">Send an inquiry</p>
          <h2 className="mt-2 mb-10 text-center font-display text-4xl font-bold md:text-5xl">Tell us what you need</h2>
          <InquiryForm />
        </div>
      </section>


      <section className="bg-soft py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-brand font-display text-2xl font-bold text-primary-foreground">KSB</span>
          <h3 className="mt-5 font-display text-3xl font-bold">Khurram Shahzad Baig</h3>
          <p className="flex items-center gap-1 font-semibold text-primary"><BadgeCheck className="h-4 w-4" /> CEO, KS Big Real Estate</p>
          <p className="mt-4 max-w-2xl text-muted-foreground">"Our promise is honest dealing and the best value for every family and investor in Al-Kabeer Town."</p>
        </div>
      </section>

      <footer id="contact" className="bg-deep py-16 text-deep-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold">KS Big Real Estate</p>
            <p className="mt-3 text-deep-foreground/70">Houses · Plots · Commercial · Rentals · File Merging</p>
          </div>
          <div className="space-y-3 text-deep-foreground/85">
            <p className="flex gap-2"><MapPin className="h-5 w-5 text-accent" /> Al-Kabeer Town Phase 2, Lahore</p>
            <p className="flex gap-2"><Phone className="h-5 w-5 text-accent" /> +92 300 0000000</p>
            <p className="flex gap-2"><Mail className="h-5 w-5 text-accent" /> info@ksbigrealestate.com</p>
          </div>
          <div>
            <p className="font-semibold">Follow us</p>
            <div className="mt-4 flex gap-3">
              {socials.map(({ name, Icon, href }) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}
                  className="grid h-11 w-11 place-items-center rounded-full bg-deep-foreground/10 transition hover:bg-accent hover:text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/pdf"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition hover:opacity-90"
          >
            View PDF Maps <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-12 text-center text-sm text-deep-foreground/60">© 2026 KS Big Real Estate. All rights reserved.</p>
      </footer>
    </div>
  );
}
