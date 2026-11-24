import { useSyncExternalStore } from "react";

const ADMIN_SESSION_KEY = "ksbaig_admin_session";
const ADMIN_SESSION_EVENT = "ksbaig-admin-session-change";

const adminUsername = import.meta.env["VITE_ADMIN_USERNAME"];
const adminPassword = import.meta.env["VITE_ADMIN_PASSWORD"];

export function isAdminConfigured(): boolean {
  return Boolean(adminUsername && adminPassword);
}

export function authenticateAdmin(username: string, password: string): boolean {
  if (!isAdminConfigured()) {
    return false;
  }

  if (username !== adminUsername || password !== adminPassword) {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
  return true;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated";
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

function subscribeToAdminSession(onChange: () => void): () => void {
  window.addEventListener(ADMIN_SESSION_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ADMIN_SESSION_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useAdminAuthenticated(): boolean {
  return useSyncExternalStore(subscribeToAdminSession, isAdminAuthenticated, () => false);
}
