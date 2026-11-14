import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bath, BedDouble, Home, MapPin, Ruler, Search } from "lucide-react";

export type DemoProperty = {
  id: string;
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
};

type PropertyListingsProps = {
  heading: string;
  idPrefix: string;
  kindLabel: string;
  priceCaption: string;
  priceSuffix?: string;
  listingMode?: "Buy" | "Rent";
  properties: DemoProperty[];
};

const location = "Al-Kabeer Town Phase 2, Lahore";
const priceFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});
const controlClassName =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function PropertyListings({
  heading,
  idPrefix,
  kindLabel,
  priceCaption,
  priceSuffix = "",
  listingMode = "Buy",
  properties: demoProperties,
}: PropertyListingsProps) {
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("Any Type");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [beds, setBeds] = useState("All");
  const [sort, setSort] = useState("default");
  const search = query.trim().toLowerCase();
  const properties = demoProperties
    .filter((property) => {
      const matchesSearch = `${property.title} ${location}`.toLowerCase().includes(search);
      const matchesType = propertyType === "Any Type" || propertyType === "House";
      const matchesMinPrice = !minPrice || property.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || property.price <= Number(maxPrice);
      const matchesMinArea = !minArea || property.area >= Number(minArea);
      const matchesMaxArea = !maxArea || property.area <= Number(maxArea);
      const matchesBeds = beds === "All" || property.bedrooms >= Number(beds);
      return (
        matchesSearch &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinArea &&
        matchesMaxArea &&
        matchesBeds
      );
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  function resetSearch() {
    setQuery("");
    setPropertyType("Any Type");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setBeds("All");
    setSort("default");
  }

  return (
    <div className="min-h-screen bg-soft font-sans">
      <header className="bg-deep text-deep-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold">
              KS
            </span>
            <span className="font-display text-lg font-bold sm:text-xl">KS Big Real Estate</span>
          </Link>
          <Link
            to="/"
            hash="inquiry"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Send an inquiry
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link
            to="/"
            className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{heading}</span>
        </nav>

        <p className="font-semibold uppercase tracking-widest text-primary">Find your next home</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{heading}</h1>
        <p className="mt-4 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" /> {location}
        </p>
        <p className="mt-6 rounded-2xl border bg-secondary p-4 text-sm leading-relaxed text-secondary-foreground">
          <strong>Demo listings only.</strong> These homes, prices and specifications are fictional
          examples, not available properties. Images are placeholders. Contact KS Big Real Estate
          for current availability and prices.
        </p>

        <section
          aria-label="Search properties"
          className="mt-8 rounded-2xl border border-primary/20 bg-deep p-5 text-deep-foreground shadow-sm"
        >
          <div className="flex flex-wrap gap-2 border-b border-deep-foreground/20 pb-4">
            {(["Buy", "Rent", "Required"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={listingMode === mode}
                className={`rounded-md px-5 py-2 text-sm font-semibold transition ${
                  listingMode === mode
                    ? "bg-accent text-accent-foreground"
                    : "text-deep-foreground/80 hover:bg-deep-foreground/10"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-accent">
              City
              <select
                aria-label="City"
                defaultValue="Any City"
                className={`${controlClassName} mt-1 border-0 bg-card text-foreground`}
              >
                <option>Any City</option>
                <option>Lahore</option>
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-accent lg:col-span-2">
              Location
              <div className="relative mt-1">
                <Search
                  className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id={`${idPrefix}-search`}
                  aria-label="Search homes"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter location, project or landmark"
                  className={`${controlClassName} border-0 bg-card pl-10 text-foreground`}
                />
              </div>
            </label>
            <button
              type="button"
              className="self-end rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
            >
              <Search className="mr-2 inline-block h-4 w-4" aria-hidden="true" />
              Find
            </button>
            <label className="text-xs font-semibold uppercase tracking-wide text-accent">
              Property Type
              <select
                aria-label="Property type"
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className={`${controlClassName} mt-1 border-0 bg-card text-foreground`}
              >
                <option>Any Type</option>
                <option>House</option>
                <option>Plot</option>
                <option>Commercial</option>
              </select>
            </label>
            <fieldset className="text-xs font-semibold uppercase tracking-wide text-accent">
              <legend>Price (PKR)</legend>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  aria-label="Minimum price"
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="Min"
                  className={`${controlClassName} border-0 bg-card text-foreground`}
                />
                <input
                  aria-label="Maximum price"
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Max"
                  className={`${controlClassName} border-0 bg-card text-foreground`}
                />
              </div>
            </fieldset>
            <fieldset className="text-xs font-semibold uppercase tracking-wide text-accent">
              <legend>Area (Marla)</legend>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  aria-label="Minimum area"
                  type="number"
                  min="0"
                  value={minArea}
                  onChange={(event) => setMinArea(event.target.value)}
                  placeholder="Min"
                  className={`${controlClassName} border-0 bg-card text-foreground`}
                />
                <input
                  aria-label="Maximum area"
                  type="number"
                  min="0"
                  value={maxArea}
                  onChange={(event) => setMaxArea(event.target.value)}
                  placeholder="Max"
                  className={`${controlClassName} border-0 bg-card text-foreground`}
                />
              </div>
            </fieldset>
            <label className="text-xs font-semibold uppercase tracking-wide text-accent">
              Beds
              <select
                aria-label="Beds"
                value={beds}
                onChange={(event) => setBeds(event.target.value)}
                className={`${controlClassName} mt-1 border-0 bg-card text-foreground`}
              >
                <option>All</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </label>
          </div>
          <p className="mt-4 text-xs text-deep-foreground/70">
            Popular: #Houses for Sale&nbsp; #Plots for Sale&nbsp; #For Rent
          </p>
        </section>

        <section aria-labelledby={`${idPrefix}-results-heading`} className="mt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id={`${idPrefix}-results-heading`} className="font-display text-2xl font-bold">
                Search Results
              </h2>
              <p role="status" className="mt-1 text-sm text-muted-foreground">
                {properties.length} demo {properties.length === 1 ? "result" : "results"} found
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor={`${idPrefix}-sort`} className="mb-2 block text-sm font-semibold">
                  Sort by
                </label>
                <select
                  id={`${idPrefix}-sort`}
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className={controlClassName}
                >
                  <option value="default">Default order</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </div>
              {(query ||
                propertyType !== "Any Type" ||
                minPrice ||
                maxPrice ||
                minArea ||
                maxArea ||
                beds !== "All" ||
                sort !== "default") && (
                <button
                  type="button"
                  onClick={resetSearch}
                  className="rounded-xl border bg-card px-4 py-3 text-sm font-semibold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Reset search
                </button>
              )}
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {properties.map((property) => (
                <article
                  key={property.id}
                  aria-labelledby={`${property.id}-title`}
                  className="overflow-hidden rounded-2xl border bg-card shadow-sm"
                >
                  <div className="relative flex aspect-[16/9] min-h-64 w-full flex-col items-center justify-center bg-brand pb-16 pt-10 text-primary-foreground">
                    <span className="absolute left-4 top-4 rounded-full bg-deep px-3 py-1 text-xs font-semibold uppercase tracking-wide text-deep-foreground">
                      Demo property
                    </span>
                    <Home className="h-16 w-16 opacity-70" aria-hidden="true" />
                    <span className="mt-3 text-sm">Photo placeholder</span>
                    <div className="absolute inset-x-0 bottom-0 bg-deep/90 px-5 py-3 text-deep-foreground">
                      <span className="text-xs">{priceCaption}</span>
                      <p className="text-xl font-bold">
                        {priceFormatter.format(property.price)}
                        {priceSuffix}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 id={`${property.id}-title`} className="text-xl font-bold">
                      {property.title}
                    </h3>
                    <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {location}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                      {kindLabel}
                    </p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 border-b pb-5 text-sm">
                      <div>
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <BedDouble className="h-4 w-4" aria-hidden="true" /> Beds
                        </dt>
                        <dd className="mt-1 font-semibold">{property.bedrooms}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <Bath className="h-4 w-4" aria-hidden="true" /> Baths
                        </dt>
                        <dd className="mt-1 font-semibold">{property.bathrooms}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <Ruler className="h-4 w-4" aria-hidden="true" /> Area
                        </dt>
                        <dd className="mt-1 font-semibold">{property.area} Marla</dd>
                      </div>
                    </dl>
                    <Link
                      to="/"
                      hash="inquiry"
                      className="mt-5 inline-flex items-center gap-2 rounded font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Inquire about real homes <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-card px-6 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold">No homes match your search</h3>
              <p className="mt-2 text-muted-foreground">
                Try a different home name, size or location, or reset your search above.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t bg-card px-6 py-8 text-center text-sm text-muted-foreground">
        <p>KS Big Real Estate / Al-Kabeer Town Phase 2, Lahore</p>
        <Link
          to="/"
          className="mt-3 inline-block rounded font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back to home
        </Link>
      </footer>
    </div>
  );
}
