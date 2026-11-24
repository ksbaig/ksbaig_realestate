import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminStatus } from "@/components/AdminStatus";
import { CommercialPage, FileMergingPage, OpenLandPage } from "@/components/OpenLandPage";

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

async function renderPage(Page: () => React.JSX.Element, heading: string) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <><AdminStatus /><Page /></> }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { name: heading, level: 1 });
}

function addListing(title: string) {
  fireEvent.click(screen.getByRole("button", { name: "New listing" }));
  fireEvent.change(screen.getByLabelText("Listing title"), { target: { value: title } });
  fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Lahore" } });
  fireEvent.change(screen.getByLabelText("Price (PKR)"), { target: { value: "1500000" } });
  fireEvent.change(screen.getByLabelText("Area (Marla)"), { target: { value: "3.5" } });
  fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Example details" } });
  fireEvent.click(screen.getByRole("button", { name: "Add listing" }));
}

describe("Commercial and file merging listings", () => {
  it.each([
    { Page: CommercialPage, heading: "Commercial", empty: "No commercial listings yet" },
    { Page: FileMergingPage, heading: "File Merging", empty: "No file merging listings yet" },
  ])("manages $heading listings and hides admin controls from visitors", async ({ Page, heading, empty }) => {
    await renderPage(Page, heading);
    expect(await screen.findByRole("heading", { name: empty })).toBeVisible();
    expect(screen.queryByRole("button", { name: "New listing" })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    await renderPage(Page, heading);
    await screen.findByRole("button", { name: "New listing" });
    addListing("First listing");
    expect(screen.getByRole("heading", { name: "First listing" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Edit First listing" }));
    fireEvent.change(screen.getByLabelText("Listing title"), { target: { value: "Updated listing" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByText("Example details")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Hide Updated listing from public" }));
    expect(screen.getByText("Hidden from public")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Admin logged in/i }));
    expect(screen.queryByRole("heading", { name: "Updated listing" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "New listing" })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage(Page, heading);
    fireEvent.click(await screen.findByRole("button", { name: "Show Updated listing to public" }));
    cleanup();
    sessionStorage.clear();
    await renderPage(Page, heading);
    expect(await screen.findByRole("heading", { name: "Updated listing" })).toBeVisible();
    expect(screen.queryByRole("button", { name: /^Edit / })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage(Page, heading);
    fireEvent.click(await screen.findByRole("button", { name: "Delete Updated listing" }));
    expect(screen.getByRole("heading", { name: "Updated listing" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete Updated listing" }));
    cleanup();
    await renderPage(Page, heading);
    expect(await screen.findByRole("heading", { name: empty })).toBeVisible();
  }, 15000);

  it("keeps listings separate from each other and open land", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage(CommercialPage, "Commercial");
    await screen.findByRole("button", { name: "New listing" });
    addListing("Commercial property");
    cleanup();
    await renderPage(FileMergingPage, "File Merging");
    expect(await screen.findByRole("heading", { name: "No file merging listings yet" })).toBeVisible();
    addListing("File offer");
    cleanup();
    await renderPage(CommercialPage, "Commercial");
    expect(await screen.findByRole("heading", { name: "Commercial property" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "File offer" })).not.toBeInTheDocument();
    cleanup();
    await renderPage(OpenLandPage, "Open Land");
    expect(await screen.findByRole("heading", { name: "No plots listed yet" })).toBeVisible();
  }, 15000);
});
