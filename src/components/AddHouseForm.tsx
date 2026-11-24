import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { NewHouseData } from "./AddHouseModal";

interface AddHouseFormProps {
  onSubmit: (data: NewHouseData & { imageUrls?: string[] }) => void;
  onCancel: () => void;
  initialValues?: NewHouseData;
}

export function AddHouseForm({ onSubmit, onCancel, initialValues }: AddHouseFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewHouseData>({
    defaultValues: initialValues ?? {},
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB per image");
        return false;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files");
        return false;
      }
      return true;
    });

    setImages(validFiles);
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
    setError("");
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!images.length) return [];

    const uploadedUrls: string[] = [];

    for (const image of images) {
      const reader = new FileReader();

      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result !== "string") {
            reject(new Error("Failed to read image"));
            return;
          }
          uploadedUrls.push(reader.result);
          resolve();
        };
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(image);
      });
    }

    return uploadedUrls;
  };

  const onFormSubmit = async (data: NewHouseData) => {
    setLoading(true);
    setError("");

    try {
      const imageUrls = images.length > 0 ? await uploadImages() : initialValues?.imageUrls ?? [];

      onSubmit({
        ...data,
        imageUrls,
      });

      reset();
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      setError("Failed to submit form. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <label htmlFor="property-title" className="block text-sm font-semibold mb-1">Property Title *</label>
        <Input
          id="property-title"
          {...register("title", { required: "Title is required" })}
          placeholder="e.g., 3 Marla Modern Home"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.title && <span className="text-red-600 text-sm">{errors.title.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="property-price" className="block text-sm font-semibold mb-1">Price (PKR) *</label>
          <Input
            id="property-price"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
              valueAsNumber: true,
            })}
            type="number"
            placeholder="e.g., 8500000"
            className="border rounded px-3 py-2 w-full"
          />
          {errors.price && <span className="text-red-600 text-sm">{errors.price.message}</span>}
        </div>

        <div>
          <label htmlFor="property-area" className="block text-sm font-semibold mb-1">Area (Marla) *</label>
          <Input
            id="property-area"
            {...register("area", {
              required: "Area is required",
              min: { value: 0, message: "Area must be positive" },
              valueAsNumber: true,
            })}
            type="number"
            placeholder="e.g., 3"
            className="border rounded px-3 py-2 w-full"
          />
          {errors.area && <span className="text-red-600 text-sm">{errors.area.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="property-bedrooms" className="block text-sm font-semibold mb-1">Bedrooms *</label>
          <Input
            id="property-bedrooms"
            {...register("bedrooms", {
              required: "Bedrooms required",
              min: { value: 0, message: "Must be positive" },
              valueAsNumber: true,
            })}
            type="number"
            placeholder="e.g., 3"
            className="border rounded px-3 py-2 w-full"
          />
          {errors.bedrooms && <span className="text-red-600 text-sm">{errors.bedrooms.message}</span>}
        </div>

        <div>
          <label htmlFor="property-bathrooms" className="block text-sm font-semibold mb-1">Bathrooms *</label>
          <Input
            id="property-bathrooms"
            {...register("bathrooms", {
              required: "Bathrooms required",
              min: { value: 0, message: "Must be positive" },
              valueAsNumber: true,
            })}
            type="number"
            placeholder="e.g., 3"
            className="border rounded px-3 py-2 w-full"
          />
          {errors.bathrooms && <span className="text-red-600 text-sm">{errors.bathrooms.message}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="property-description" className="block text-sm font-semibold mb-1">Description</label>
        <Textarea
          id="property-description"
          {...register("description")}
          placeholder="Enter property description..."
          className="border rounded px-3 py-2 w-full"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="property-images" className="block text-sm font-semibold mb-2">Upload Images</label>
        <div className="border-2 border-dashed rounded-lg p-4">
          <input
            id="property-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            disabled={loading}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-2">
            {images.length > 0
              ? `${images.length} image(s) selected`
              : "Click to upload or drag and drop"}
          </p>
          {initialValues?.imageUrls?.length && images.length === 0 ? (
            <p className="mt-2 text-xs text-gray-500">
              Existing images will be kept unless you choose replacements.
            </p>
          ) : null}
        </div>
      </div>

      {previewUrls.length > 0 && (
        <div>
          <label className="block text-sm font-semibold mb-2">Image Previews</label>
          <div className="grid grid-cols-3 gap-2">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx + 1}`}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
          {loading ? "Saving..." : initialValues ? "Save changes" : "Add House"}
        </Button>
      </div>
    </form>
  );
}
