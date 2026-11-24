import { useEffect, useState } from "react";
import { PropertyListings, type DemoProperty } from "@/components/PropertyListings";
import { AddHouseForm } from "@/components/AddHouseForm";
import type { NewHouseData } from "@/components/AddHouseModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useManagedCards } from "@/hooks/useManagedCards";
import { useAdminAuthenticated } from "@/lib/admin-auth";

const demoRentals: DemoProperty[] = [
  { id: "rent-1", title: "3 Marla Family Home", price: 85000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "rent-2", title: "5 Marla Spacious Home", price: 145000, area: 5, bedrooms: 4, bathrooms: 4 },
  { id: "rent-3", title: "2 Marla Compact Home", price: 45000, area: 2, bedrooms: 2, bathrooms: 2 },
  { id: "rent-4", title: "5 Marla Corner Home", price: 165000, area: 5, bedrooms: 4, bathrooms: 5 },
  { id: "rent-5", title: "3 Marla Courtyard Home", price: 95000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "rent-6", title: "2 Marla Starter Home", price: 55000, area: 2, bedrooms: 2, bathrooms: 3 },
];

export function RentListings() {
  const isAdmin = useAdminAuthenticated();
  const [editing, setEditing] = useState<DemoProperty | null>(null);
  const { cards, loaded, error, saveCard, deleteCard, toggleVisibility } = useManagedCards(
    demoRentals,
    "ksbaig_rent_demo_changes",
    "rental listings",
  );

  useEffect(() => {
    if (!isAdmin) setEditing(null);
  }, [isAdmin]);

  function handleEdit(data: NewHouseData) {
    if (!editing) return;
    saveCard({ ...editing, ...data });
    setEditing(null);
  }

  return (
    <div>
      {error && <p role="alert" className="bg-destructive/10 p-4 text-center text-destructive">{error}</p>}
      {loaded ? (
        <PropertyListings
          heading="Houses for Rent"
          idPrefix="rent"
          kindLabel="Residential / rent demo"
          priceCaption="Sample monthly rent"
          priceSuffix=" / month"
          listingMode="Rent"
          properties={cards}
          {...(isAdmin && {
            adminControls: {
              onEdit: setEditing,
              onDelete: deleteCard,
              onToggleVisibility: toggleVisibility,
            },
          })}
        />
      ) : !error && <p role="status" className="p-6">Loading rental listings...</p>}
      <AlertDialog open={isAdmin && editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <AlertDialogContent className="max-h-96 max-w-2xl overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Rental Property</AlertDialogTitle>
            <AlertDialogDescription>
              Update this rental in this browser. Choose new images only if you want to replace the existing ones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {editing && (
            <AddHouseForm
              key={editing.id}
              initialValues={editing}
              onSubmit={handleEdit}
              onCancel={() => setEditing(null)}
            />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
