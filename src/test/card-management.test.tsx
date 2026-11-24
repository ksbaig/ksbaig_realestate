import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RentListings } from "@/components/RentListings";
import { SaleListings } from "@/components/SaleListings";
import { ConstructionPage } from "@/components/ConstructionPage";
import { AdminStatus } from "@/components/AdminStatus";

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

async function renderPage(component: () => React.JSX.Element, heading: string) {
  const router = createRouter({
    routeTree: createRootRoute({ component }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { name: heading, level: 1 });
}

describe("Rental and construction card management", () => {
  it("edits, hides, restores and deletes rental cards without changing sale cards", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    await renderPage(RentListings, "Houses for Rent");

    fireEvent.click(screen.getByRole("button", { name: "Edit 3 Marla Family Home" }));
    fireEvent.change(screen.getByLabelText(/Property Title/), { target: { value: "Updated rental" } });
    fireEvent.change(screen.getByLabelText(/Price \(PKR\)/), { target: { value: "90000" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await screen.findByRole("heading", { name: "Updated rental" });
    expect(screen.getByText(/90,000.*\/ month/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Hide Updated rental from public" }));
    expect(screen.getByText("Hidden from public")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete 5 Marla Spacious Home" }));
    expect(screen.getByRole("heading", { name: "5 Marla Spacious Home" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete 5 Marla Spacious Home" }));
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("heading", { name: "5 Marla Spacious Home" })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.clear();
    await renderPage(RentListings, "Houses for Rent");
    expect(screen.queryByRole("heading", { name: "Updated rental" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "5 Marla Spacious Home" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Edit / })).not.toBeInTheDocument();

    cleanup();
    await renderPage(SaleListings, "Houses for Sale");
    expect(screen.getByRole("heading", { name: "3 Marla Family Home" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "5 Marla Spacious Home" })).toBeVisible();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage(RentListings, "Houses for Rent");
    fireEvent.click(screen.getByRole("button", { name: "Show Updated rental to public" }));
    cleanup();
    sessionStorage.clear();
    await renderPage(RentListings, "Houses for Rent");
    expect(screen.getByRole("heading", { name: "Updated rental" })).toBeVisible();
  }, 15000);

  it("edits, hides, restores and deletes construction services", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await renderPage(ConstructionPage, "Construction Services");
    await screen.findByRole("button", { name: "Edit Residential Construction" });
    fireEvent.click(screen.getByRole("button", { name: "Edit Residential Construction" }));
    fireEvent.change(screen.getByLabelText("Service title"), { target: { value: "Custom construction" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Updated service details." } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("heading", { name: "Custom construction" })).toBeVisible();
    expect(screen.getByText("Updated service details.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Hide Custom construction from public" }));
    expect(screen.getByText("Hidden from public")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete Renovation" }));

    cleanup();
    sessionStorage.clear();
    await renderPage(ConstructionPage, "Construction Services");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Commercial Construction" })).toBeVisible());
    expect(screen.queryByRole("heading", { name: "Custom construction" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Renovation" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Edit / })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage(ConstructionPage, "Construction Services");
    fireEvent.click(await screen.findByRole("button", { name: "Show Custom construction to public" }));
    cleanup();
    sessionStorage.clear();
    await renderPage(ConstructionPage, "Construction Services");
    expect(await screen.findByRole("heading", { name: "Custom construction" })).toBeVisible();
    expect(screen.getByText("Updated service details.")).toBeVisible();
  });

  it("reports storage errors without applying visibility changes", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage(RentListings, "Houses for Rent");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage is full");
    });
    fireEvent.click(screen.getByRole("button", { name: "Hide 3 Marla Family Home from public" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Could not change visibility");
    expect(screen.getByRole("button", { name: "Hide 3 Marla Family Home from public" })).toBeVisible();
    expect(screen.queryByText("Hidden from public")).not.toBeInTheDocument();
  });

  it.each([
    { component: RentListings, heading: "Houses for Rent", title: "3 Marla Family Home" },
    { component: ConstructionPage, heading: "Construction Services", title: "Renovation" },
  ])("removes admin controls and hidden cards on logout from $heading", async ({ component: Page, heading, title }) => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    function PageWithStatus() {
      return <><AdminStatus /><Page /></>;
    }
    await renderPage(PageWithStatus, heading);
    fireEvent.click(await screen.findByRole("button", { name: `Hide ${title} from public` }));
    fireEvent.click(screen.getByRole("button", { name: /Admin logged in/i }));
    expect(screen.queryByRole("heading", { name: title })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Edit / })).not.toBeInTheDocument();
  });
});
