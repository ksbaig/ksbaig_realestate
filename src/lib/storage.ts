import type { DemoProperty } from "@/components/PropertyListings";

export interface StoredProperty extends DemoProperty {
  description?: string;
  imageUrls?: string[];
  createdAt: string;
}

const STORAGE_KEY = "ksbaig_sale_properties";
const DEMO_CHANGES_KEY = "ksbaig_sale_demo_changes";

type DemoChanges = Record<string, DemoProperty | null>;

export function getDemoChanges(): DemoChanges {
  const stored = localStorage.getItem(DEMO_CHANGES_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function saveDemoChange(id: string, property: DemoProperty | null): void {
  const changes = getDemoChanges();
  changes[id] = property;
  localStorage.setItem(DEMO_CHANGES_KEY, JSON.stringify(changes));
}

/**
 * Get all stored properties from localStorage
 */
export function getStoredProperties(): StoredProperty[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save a new property to localStorage
 */
export function addProperty(property: Omit<StoredProperty, "id" | "createdAt">): StoredProperty {
  const properties = getStoredProperties();

  const newProperty: StoredProperty = {
    ...property,
    id: `custom-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  properties.push(newProperty);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));

  return newProperty;
}

/**
 * Delete a property from localStorage
 */
export function deleteProperty(id: string): boolean {
  const properties = getStoredProperties();
  const filtered = properties.filter(p => p.id !== id);

  if (filtered.length !== properties.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  return false;
}

/**
 * Update a property in localStorage
 */
export function updateProperty(id: string, updates: Partial<StoredProperty>): StoredProperty | null {
  const properties = getStoredProperties();
  const index = properties.findIndex(p => p.id === id);

  if (index === -1) return null;

  const existing = properties[index];
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  properties[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));

  return updated;
}
