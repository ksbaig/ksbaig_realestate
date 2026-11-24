import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RentListings } from "@/components/RentListings";
import { SaleListings } from "@/components/SaleListings";
import { AdminStatus } from "@/components/AdminStatus";

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

async function renderListings(component = SaleListings, heading = "Houses for Sale") {
  const router = createRouter({
    routeTree: createRootRoute({ component }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { name: heading, level: 1 });
}

function resultTitles() {
  return screen
    .getAllByRole("article")
    .map((card) => within(card).getByRole("heading", { level: 3 }).textContent);
}

describe("Sale listings", () => {
  it("filters demo homes by name, size and location, ignoring case and surrounding whitespace", async () => {
    await renderListings();
    expect(screen.getByText("Demo listings only.")).toBeVisible();

    fireEvent.change(screen.getByLabelText("Search homes"), { target: { value: "  2 MARLA  " } });
    expect(screen.getByRole("status")).toHaveTextContent("2 demo results found");
    expect(resultTitles()).toEqual(["2 Marla Compact Home", "2 Marla Starter Home"]);

    fireEvent.change(screen.getByLabelText("Search homes"), { target: { value: "corner" } });
    expect(resultTitles()).toEqual(["5 Marla Corner Home"]);
    expect(screen.getByRole("status")).toHaveTextContent("1 demo result found");

    fireEvent.change(screen.getByLabelText("Search homes"), { target: { value: "LAHORE" } });
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });

  it("sorts numerically in both directions and restores the default order on reset", async () => {
    await renderListings();
    const originalOrder = resultTitles();
    fireEvent.change(screen.getByLabelText("Sort by"), { target: { value: "price-asc" } });
    expect(resultTitles()).toEqual([
      "2 Marla Compact Home",
      "2 Marla Starter Home",
      "3 Marla Family Home",
      "3 Marla Courtyard Home",
      "5 Marla Spacious Home",
      "5 Marla Corner Home",
    ]);
    fireEvent.change(screen.getByLabelText("Sort by"), { target: { value: "price-desc" } });
    expect(resultTitles()).toEqual([
      "5 Marla Corner Home",
      "5 Marla Spacious Home",
      "3 Marla Courtyard Home",
      "3 Marla Family Home",
      "2 Marla Starter Home",
      "2 Marla Compact Home",
    ]);
    fireEvent.change(screen.getByLabelText("Search homes"), { target: { value: "3 marla" } });
    expect(resultTitles()).toEqual(["3 Marla Courtyard Home", "3 Marla Family Home"]);

    fireEvent.click(screen.getByRole("button", { name: "Reset search" }));
    expect(screen.getByLabelText("Search homes")).toHaveValue("");
    expect(screen.getByLabelText("Sort by")).toHaveValue("default");
    expect(resultTitles()).toEqual(originalOrder);
  });

  it("shows an empty state for unmatched searches and links inquiries to the existing form", async () => {
    await renderListings();
    expect(screen.getAllByRole("link", { name: "Inquire about real homes" })[0]).toHaveAttribute(
      "href",
      "/#inquiry",
    );
    fireEvent.change(screen.getByLabelText("Search homes"), {
      target: { value: "unmatched property" },
    });
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("status")).toHaveTextContent("0 demo results found");
    expect(screen.getByRole("heading", { name: "No homes match your search" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Reset search" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });

  it("shows demo rents per month on the rent page and filters them by search", async () => {
    await renderListings(RentListings, "Houses for Rent");
    expect(screen.getByText(/85,000.*\/ month/)).toBeVisible();

    fireEvent.change(screen.getByLabelText("Sort by"), { target: { value: "price-asc" } });
    expect(resultTitles()[0]).toBe("2 Marla Compact Home");

    fireEvent.change(screen.getByLabelText("Search homes"), { target: { value: "starter" } });
    expect(resultTitles()).toEqual(["2 Marla Starter Home"]);
  });

  it("edits and hides a stored property for admins, preserving its images and visibility after reload", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    localStorage.setItem("ksbaig_sale_properties", JSON.stringify([{
      id: "custom-1",
      title: "Custom home",
      price: 85000,
      area: 3,
      bedrooms: 3,
      bathrooms: 2,
      description: "Original description",
      imageUrls: ["data:image/png;base64,test"],
      createdAt: "2026-01-01",
    }]));
    await renderListings();

    fireEvent.click(screen.getByRole("button", { name: "Edit Custom home" }));
    fireEvent.change(screen.getByLabelText(/Property Title/), { target: { value: "Updated home" } });
    fireEvent.change(screen.getByLabelText(/Price \(PKR\)/), { target: { value: "99000" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await screen.findByRole("heading", { name: "Updated home" });
    expect(JSON.parse(localStorage.getItem("ksbaig_sale_properties")!)[0]).toMatchObject({
      title: "Updated home",
      price: 99000,
      description: "Original description",
      imageUrls: ["data:image/png;base64,test"],
    });

    fireEvent.click(screen.getByRole("button", { name: "Hide Updated home from public" }));
    expect(screen.getByText("Hidden from public")).toBeVisible();
    cleanup();
    sessionStorage.clear();
    await renderListings();
    expect(screen.queryByRole("heading", { name: "Updated home" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Edit/ })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderListings();
    fireEvent.click(screen.getByRole("button", { name: "Show Updated home to public" }));
    cleanup();
    sessionStorage.clear();
    await renderListings();
    expect(screen.getByRole("heading", { name: "Updated home" })).toBeVisible();
  });

  it("persists edits, hiding and confirmed deletion of demo properties", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    await renderListings();
    fireEvent.click(screen.getByRole("button", { name: "Edit 3 Marla Family Home" }));
    fireEvent.change(screen.getByLabelText(/Property Title/), { target: { value: "Edited demo" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await screen.findByRole("heading", { name: "Edited demo" });
    fireEvent.click(screen.getByRole("button", { name: "Hide Edited demo from public" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete 5 Marla Spacious Home" }));
    expect(screen.getByRole("heading", { name: "5 Marla Spacious Home" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete 5 Marla Spacious Home" }));
    expect(confirm).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(screen.queryByRole("heading", { name: "5 Marla Spacious Home" })).not.toBeInTheDocument());

    cleanup();
    sessionStorage.clear();
    await renderListings();
    expect(screen.queryByRole("heading", { name: "Edited demo" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "5 Marla Spacious Home" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("deletes a user-added property only after confirmation", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    localStorage.setItem("ksbaig_sale_properties", JSON.stringify([{
      id: "custom-1", title: "Custom home", price: 1, area: 1,
      bedrooms: 1, bathrooms: 1, createdAt: "2026-01-01",
    }]));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await renderListings();
    fireEvent.click(screen.getByRole("button", { name: "Delete Custom home" }));
    expect(screen.queryByRole("heading", { name: "Custom home" })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("ksbaig_sale_properties")!)).toEqual([]);
  });

  it("reports storage failures without overwriting existing listings", async () => {
    localStorage.setItem("ksbaig_sale_properties", "invalid data");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const router = createRouter({
      routeTree: createRootRoute({ component: SaleListings }),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load sale listings");
    expect(localStorage.getItem("ksbaig_sale_properties")).toBe("invalid data");
  });

  it("updates the admin indicator and sale controls immediately on session changes", async () => {
    function SalePageWithStatus() {
      return <><AdminStatus /><SaleListings /></>;
    }

    await renderListings(SalePageWithStatus);
    expect(screen.queryByRole("button", { name: /Admin logged in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit 3 Marla Family Home" })).not.toBeInTheDocument();

    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    fireEvent(window, new StorageEvent("storage", { key: "ksbaig_admin_session" }));
    expect(screen.getByRole("button", { name: /Admin logged in/i })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Hide 3 Marla Family Home from public" }));
    expect(screen.getByText("Hidden from public")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Admin logged in/i }));
    expect(screen.queryByRole("button", { name: /Admin logged in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Edit/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "New property" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "3 Marla Family Home" })).not.toBeInTheDocument();
    expect(sessionStorage.getItem("ksbaig_admin_session")).toBeNull();
  });
});
