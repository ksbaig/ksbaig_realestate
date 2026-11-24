import { useState, useEffect } from "react";
import { PropertyListings, type DemoProperty } from "@/components/PropertyListings";
import { AddHouseModal, type NewHouseData } from "./AddHouseModal";
import { AddHouseForm } from "./AddHouseForm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getStoredProperties,
  getDemoChanges,
  saveDemoChange,
  addProperty,
  deleteProperty,
  updateProperty,
  type StoredProperty,
} from "@/lib/storage";
import { isAdminAuthenticated, useAdminAuthenticated } from "@/lib/admin-auth";

const demoProperties: DemoProperty[] = [
  { id: "demo-1", title: "3 Marla Family Home", price: 8500000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "demo-2", title: "5 Marla Spacious Home", price: 14500000, area: 5, bedrooms: 4, bathrooms: 4 },
  { id: "demo-3", title: "2 Marla Compact Home", price: 5500000, area: 2, bedrooms: 2, bathrooms: 2 },
  { id: "demo-4", title: "5 Marla Corner Home", price: 16500000, area: 5, bedrooms: 4, bathrooms: 5 },
  { id: "demo-5", title: "3 Marla Courtyard Home", price: 9500000, area: 3, bedrooms: 3, bathrooms: 3 },
  { id: "demo-6", title: "2 Marla Starter Home", price: 6500000, area: 2, bedrooms: 2, bathrooms: 3 },
];

export function SaleListings() {
  const [properties, setProperties] = useState<DemoProperty[]>([]);
  const isAdmin = useAdminAuthenticated();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<DemoProperty | null>(null);

  useEffect(() => {
    function loadProperties() {
      try {
        const changes = getDemoChanges();
        const demos = demoProperties.flatMap((property) => {
          const change = changes[property.id];
          return change === null ? [] : [change ?? property];
        });
        setProperties([...demos, ...getStoredProperties()]);
        setError("");
        setLoaded(true);
      } catch (loadError) {
        console.error("Could not load sale listings:", loadError);
        setError("Could not load sale listings from this browser. Check your browser storage.");
        setLoaded(false);
      }
    }

    loadProperties();
    window.addEventListener("storage", loadProperties);
    return () => window.removeEventListener("storage", loadProperties);
  }, []);

  useEffect(() => {
    if (!isAdmin) setEditing(null);
  }, [isAdmin]);

  function requireAdmin() {
    if (!isAdminAuthenticated()) {
      throw new Error("Please sign in as an administrator to manage properties.");
    }
  }

  const handleAddHouse = (houseData: NewHouseData & { imageUrls?: string[] }) => {
    requireAdmin();
    const newProperty: Omit<StoredProperty, "id" | "createdAt"> = {
      title: houseData.title,
      price: houseData.price,
      area: houseData.area,
      bedrooms: houseData.bedrooms,
      bathrooms: houseData.bathrooms,
      ...(houseData.description !== undefined && { description: houseData.description }),
      ...(houseData.imageUrls !== undefined && { imageUrls: houseData.imageUrls }),
    };

    const savedProperty = addProperty(newProperty);
    setProperties((current) => [...current, savedProperty]);

    // Show success message
    alert("House added successfully!");
  };

  function saveProperty(property: DemoProperty) {
    requireAdmin();
    if (property.id.startsWith("demo-")) {
      saveDemoChange(property.id, property);
    } else if (!updateProperty(property.id, property)) {
      throw new Error("Property not found in browser storage.");
    }
    setProperties((current) => current.map((item) => item.id === property.id ? property : item));
    setError("");
  }

  function handleEdit(data: NewHouseData) {
    if (!editing) return;
    saveProperty({ ...editing, ...data });
    setEditing(null);
  }

  function handleDelete(property: DemoProperty) {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    try {
      requireAdmin();
      if (property.id.startsWith("demo-")) {
        saveDemoChange(property.id, null);
      } else if (!deleteProperty(property.id)) {
        throw new Error("Property not found in browser storage.");
      }
      setProperties((current) => current.filter((item) => item.id !== property.id));
      setError("");
    } catch (deleteError) {
      console.error("Could not delete property:", deleteError);
      setError("Could not delete the property. Check your admin session and browser storage.");
    }
  }

  function handleToggleVisibility(property: DemoProperty) {
    try {
      saveProperty({ ...property, hidden: !property.hidden });
    } catch (visibilityError) {
      console.error("Could not change property visibility:", visibilityError);
      setError("Could not change visibility. Check your admin session and browser storage.");
    }
  }

  return (
    <div>
      {error && <p role="alert" className="bg-destructive/10 p-4 text-center text-destructive">{error}</p>}
      {loaded ? (
        <PropertyListings
          heading="Houses for Sale"
          idPrefix="sale"
          kindLabel="Residential / sale demo"
          priceCaption="Sample price"
          properties={properties}
          {...(isAdmin && {
            adminControls: {
              onEdit: setEditing,
              onDelete: handleDelete,
              onToggleVisibility: handleToggleVisibility,
            },
          })}
        />
      ) : !error && <p role="status" className="p-6">Loading sale listings...</p>}

      {loaded && isAdmin && <AddHouseModal onAddHouse={handleAddHouse} />}
      <AlertDialog open={isAdmin && editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <AlertDialogContent className="max-h-96 max-w-2xl overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Property</AlertDialogTitle>
            <AlertDialogDescription>
              Update this property in this browser. Choose new images only if you want to replace the existing ones.
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
