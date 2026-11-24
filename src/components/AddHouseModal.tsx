import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddHouseForm } from "./AddHouseForm";

export interface NewHouseData {
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  imageUrls?: string[];
}

interface AddHouseModalProps {
  onAddHouse: (houseData: NewHouseData & { imageUrls?: string[] }) => void;
}

export function AddHouseModal({ onAddHouse }: AddHouseModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: NewHouseData & { imageUrls?: string[] }) => {
    onAddHouse(data);
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 bg-accent hover:bg-accent/90 fixed bottom-6 right-6 z-40"
      >
        <Plus className="h-5 w-5" />
        New property
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-h-96 max-w-2xl overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Property</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the property details and upload images. Listings are saved in this browser.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AddHouseForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
