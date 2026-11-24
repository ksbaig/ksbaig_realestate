import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Files, LandPlot, MapPin, Plus, Ruler } from "lucide-react";
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

type Plot = {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  description: string;
  hidden?: boolean;
};

const initialPlots: Plot[] = [];
const priceFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});
const inputClass = "mt-2 w-full rounded-md border bg-background px-3 py-2";

const listingPages = {
  openLand: {
    heading: "Open Land",
    tagline: "Find your next plot",
    storageKey: "ksbaig_open_land_changes",
    label: "open land listings",
    item: "plot",
    itemTitle: "Plot",
    plural: "plots",
    emptyHeading: "No plots listed yet",
    Icon: LandPlot,
  },
  commercial: {
    heading: "Commercial",
    tagline: "Find commercial property",
    storageKey: "ksbaig_commercial_changes",
    label: "commercial listings",
    item: "listing",
    itemTitle: "Listing",
    plural: "commercial properties",
    emptyHeading: "No commercial listings yet",
    Icon: Ruler,
  },
  fileMerging: {
    heading: "File Merging",
    tagline: "Explore file merging",
    storageKey: "ksbaig_file_merging_changes",
    label: "file merging listings",
    item: "listing",
    itemTitle: "Listing",
    plural: "file merging options",
    emptyHeading: "No file merging listings yet",
    Icon: Files,
  },
} as const;

function ListingPage({ category }: { category: keyof typeof listingPages }) {
  const { heading, tagline, storageKey, label, item, itemTitle, plural, emptyHeading, Icon } = listingPages[category];
  const isAdmin = useAdminAuthenticated();
  const [editing, setEditing] = useState<Plot | "new" | null>(null);
  const [formError, setFormError] = useState("");
  const { cards, loaded, error, addCard, saveCard, deleteCard, toggleVisibility } =
    useManagedCards(initialPlots, storageKey, label);

  useEffect(() => {
    if (!isAdmin) setEditing(null);
  }, [isAdmin]);

  function openForm(plot: Plot | "new") {
    setFormError("");
    setEditing(plot);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const location = String(data.get("location") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const priceValue = String(data.get("price") ?? "");
    const areaValue = String(data.get("area") ?? "");
    const price = Number(priceValue);
    const area = Number(areaValue);
    if (!title || !location || !priceValue || !areaValue ||
        !Number.isFinite(price) || price < 0 || !Number.isFinite(area) || area <= 0) {
      setFormError("Enter a title, location, non-negative price and area greater than zero.");
      return;
    }
    try {
      if (editing === "new") {
        addCard({ id: crypto.randomUUID(), title, location, price, area, description });
      } else {
        saveCard({ ...editing, title, location, price, area, description });
      }
      setEditing(null);
      setFormError("");
    } catch (saveError) {
      console.error(`Could not save ${label}:`, saveError);
      setFormError(`Could not save the ${item}. Check your admin session and browser storage.`);
    }
  }

  const visibleCards = cards.filter((card) => isAdmin || !card.hidden);
  const plot = editing === "new" ? null : editing;

  return (
    <div className="min-h-screen bg-soft font-sans">
      <header className="bg-deep text-deep-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold">KSB</span>
            <span className="font-display text-lg font-bold sm:text-xl">KSBaig Real Estate</span>
          </Link>
          <Link to="/" hash="inquiry" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90">
            Send an inquiry
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{heading}</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-primary">{tagline}</p>
            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{heading}</h1>
          </div>
          {isAdmin && loaded && (
            <button type="button" onClick={() => openForm("new")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" aria-hidden="true" /> New {item}
            </button>
          )}
        </div>
        {error && <p role="alert" className="mt-6 text-destructive">{error}</p>}
        {!loaded && !error && <p role="status" className="mt-6">Loading {label}...</p>}
        {loaded && visibleCards.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-card p-8 text-center">
            <h2 className="text-xl font-bold">{emptyHeading}</h2>
            <p className="mt-2 text-muted-foreground">Contact us to ask about available {plural}.</p>
            <Link to="/" hash="inquiry" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              Send an inquiry <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
        {loaded && visibleCards.length > 0 && (
          <section aria-label={label} className="mt-8 grid gap-6 md:grid-cols-2">
            {visibleCards.map((card) => (
              <article key={card.id} className="rounded-2xl border bg-card p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-xl font-bold">{card.title}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> {card.location}
                </p>
                <p className="mt-4 text-lg font-bold">{priceFormatter.format(card.price)}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4" aria-hidden="true" /> {card.area} Marla
                </p>
                {card.description && <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{card.description}</p>}
                {isAdmin && card.hidden && <p className="mt-3 text-sm font-semibold text-destructive">Hidden from public</p>}
                <Link to="/" hash="inquiry" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                  Inquire about this {item} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {isAdmin && (
                  <CardAdminControls
                    title={card.title}
                    hidden={card.hidden}
                    onEdit={() => openForm(card)}
                    onDelete={() => deleteCard(card)}
                    onToggleVisibility={() => toggleVisibility(card)}
                  />
                )}
              </article>
            ))}
          </section>
        )}
      </main>

      <AlertDialog open={isAdmin && editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{plot ? "Edit" : "Add"} {itemTitle}</AlertDialogTitle>
            <AlertDialogDescription>{itemTitle} details are saved in this browser only.</AlertDialogDescription>
          </AlertDialogHeader>
          {editing && (
            <form key={plot?.id ?? "new"} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="plot-title" className="block text-sm font-semibold">{itemTitle} title</label>
                <input id="plot-title" name="title" defaultValue={plot?.title} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="plot-location" className="block text-sm font-semibold">Location</label>
                <input id="plot-location" name="location" defaultValue={plot?.location} required className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="plot-price" className="block text-sm font-semibold">Price (PKR)</label>
                  <input id="plot-price" name="price" type="number" min="0" step="any" defaultValue={plot?.price} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="plot-area" className="block text-sm font-semibold">Area (Marla)</label>
                  <input id="plot-area" name="area" type="number" min="0" step="any" defaultValue={plot?.area} required className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="plot-description" className="block text-sm font-semibold">Description</label>
                <textarea id="plot-description" name="description" rows={3} defaultValue={plot?.description} className={inputClass} />
              </div>
              {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-md border px-4 py-2 font-semibold">Cancel</button>
                <button type="submit" className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">{plot ? "Save changes" : `Add ${item}`}</button>
              </div>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function OpenLandPage() {
  return <ListingPage category="openLand" />;
}

export function CommercialPage() {
  return <ListingPage category="commercial" />;
}

export function FileMergingPage() {
  return <ListingPage category="fileMerging" />;
}
