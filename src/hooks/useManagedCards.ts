import { useEffect, useState } from "react";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type ManagedCard = {
  id: string;
  title: string;
  hidden?: boolean;
};

function readChanges<T>(storageKey: string): Record<string, T | null> {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return {};
  const changes: unknown = JSON.parse(stored);
  if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
    throw new Error("Invalid saved card changes.");
  }
  return changes as Record<string, T | null>;
}

export function useManagedCards<T extends ManagedCard>(
  defaults: T[],
  storageKey: string,
  label: string,
) {
  const [cards, setCards] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function loadCards() {
      try {
        const changes = readChanges<T>(storageKey);
        const defaultIds = new Set(defaults.map((card) => card.id));
        const defaultCards = defaults.flatMap((card) => {
          const change = changes[card.id];
          return change === null ? [] : [change ?? card];
        });
        const addedCards = Object.entries(changes).flatMap(([id, card]) =>
          !defaultIds.has(id) && card !== null ? [card] : [],
        );
        setCards([...defaultCards, ...addedCards]);
        setLoaded(true);
        setError("");
      } catch (loadError) {
        console.error(`Could not load ${label}:`, loadError);
        setError(`Could not load ${label} from this browser. Check your browser storage.`);
        setLoaded(false);
      }
    }

    loadCards();
    window.addEventListener("storage", loadCards);
    return () => window.removeEventListener("storage", loadCards);
  }, [defaults, storageKey, label]);

  function persistChange(card: T, value: T | null) {
    if (!isAdminAuthenticated()) {
      throw new Error("Please sign in as an administrator to manage cards.");
    }
    const changes = readChanges<T>(storageKey);
    changes[card.id] = value;
    localStorage.setItem(storageKey, JSON.stringify(changes));
    setCards((current) => current.flatMap((item) =>
      item.id === card.id ? (value === null ? [] : [value]) : [item],
    ));
    setError("");
  }

  function deleteCard(card: T) {
    if (!window.confirm(`Delete "${card.title}"? This cannot be undone.`)) return;
    try {
      persistChange(card, null);
    } catch (deleteError) {
      console.error(`Could not delete ${label}:`, deleteError);
      setError("Could not delete the card. Check your admin session and browser storage.");
    }
  }

  function toggleVisibility(card: T) {
    try {
      persistChange(card, { ...card, hidden: !card.hidden });
    } catch (visibilityError) {
      console.error(`Could not change ${label} visibility:`, visibilityError);
      setError("Could not change visibility. Check your admin session and browser storage.");
    }
  }

  function addCard(card: T) {
    if (!isAdminAuthenticated()) {
      throw new Error("Please sign in as an administrator to manage cards.");
    }
    const changes = readChanges<T>(storageKey);
    if (defaults.some((item) => item.id === card.id) || Object.prototype.hasOwnProperty.call(changes, card.id)) {
      throw new Error("A card with this ID already exists.");
    }
    changes[card.id] = card;
    localStorage.setItem(storageKey, JSON.stringify(changes));
    setCards((current) => [...current, card]);
    setError("");
  }

  return { cards, loaded, error, addCard, saveCard: (card: T) => persistChange(card, card), deleteCard, toggleVisibility };
}
