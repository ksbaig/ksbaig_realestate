import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { afterEach, describe, expect, it } from "vitest";
import { RentListings } from "@/components/RentListings";
import { SaleListings } from "@/components/SaleListings";

afterEach(cleanup);

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
});
