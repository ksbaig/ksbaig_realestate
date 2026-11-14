import { PropertyListings, type DemoProperty } from "@/components/PropertyListings";

const demoRentals: DemoProperty[] = [
  { id: "rent-1", title: "3 Marla Family Home", price: 85000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "rent-2", title: "5 Marla Spacious Home", price: 145000, area: 5, bedrooms: 4, bathrooms: 4 },
  { id: "rent-3", title: "2 Marla Compact Home", price: 45000, area: 2, bedrooms: 2, bathrooms: 2 },
  { id: "rent-4", title: "5 Marla Corner Home", price: 165000, area: 5, bedrooms: 4, bathrooms: 5 },
  { id: "rent-5", title: "3 Marla Courtyard Home", price: 95000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "rent-6", title: "2 Marla Starter Home", price: 55000, area: 2, bedrooms: 2, bathrooms: 3 },
];

export function RentListings() {
  return (
    <PropertyListings
      heading="Houses for Rent"
      idPrefix="rent"
      kindLabel="Residential / rent demo"
      priceCaption="Sample monthly rent"
      priceSuffix=" / month"
      listingMode="Rent"
      properties={demoRentals}
    />
  );
}
