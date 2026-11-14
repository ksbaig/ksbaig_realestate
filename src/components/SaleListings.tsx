import { PropertyListings, type DemoProperty } from "@/components/PropertyListings";

const demoProperties: DemoProperty[] = [
  { id: "demo-1", title: "3 Marla Family Home", price: 8500000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "demo-2", title: "5 Marla Spacious Home", price: 14500000, area: 5, bedrooms: 4, bathrooms: 4 },
  { id: "demo-3", title: "2 Marla Compact Home", price: 5500000, area: 2, bedrooms: 2, bathrooms: 2 },
  { id: "demo-4", title: "5 Marla Corner Home", price: 16500000, area: 5, bedrooms: 4, bathrooms: 5 },
  { id: "demo-5", title: "3 Marla Courtyard Home", price: 9500000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "demo-6", title: "2 Marla Starter Home", price: 6500000, area: 2, bedrooms: 2, bathrooms: 3 },
];

export function SaleListings() {
  return (
    <PropertyListings
      heading="Houses for Sale"
      idPrefix="sale"
      kindLabel="Residential / sale demo"
      priceCaption="Sample price"
      properties={demoProperties}
    />
  );
}
