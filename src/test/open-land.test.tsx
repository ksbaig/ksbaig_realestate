import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminStatus } from "@/components/AdminStatus";
import { OpenLandPage } from "@/components/OpenLandPage";

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

async function renderPage() {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <><AdminStatus /><OpenLandPage /></> }),
    history: createMemoryHistory({ initialEntries: ["/open-land"] }),
  });
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { name: "Open Land" });
}

describe("Open land listings", () => {
  it("starts empty and hides admin controls from visitors", async () => {
    await renderPage();
    expect(await screen.findByRole("heading", { name: "No plots listed yet" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "New plot" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Admin logged in/i })).not.toBeInTheDocument();
  });

  it("lets admins add, edit, hide, restore and delete a plot across reloads", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    await renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "New plot" }));
    fireEvent.change(screen.getByLabelText("Plot title"), { target: { value: "Garden plot" } });
    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Lahore" } });
    fireEvent.change(screen.getByLabelText("Price (PKR)"), { target: { value: "1500000" } });
    fireEvent.change(screen.getByLabelText("Area (Marla)"), { target: { value: "3.5" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Corner plot" } });
    fireEvent.click(screen.getByRole("button", { name: "Add plot" }));
    const card = screen.getByRole("article");
    expect(within(card).getByText("Garden plot")).toBeVisible();
    expect(within(card).getByText(/1,500,000/)).toBeVisible();
    expect(within(card).getByText("3.5 Marla")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Edit Garden plot" }));
    fireEvent.change(screen.getByLabelText("Plot title"), { target: { value: "Updated plot" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("heading", { name: "Updated plot" })).toBeVisible();
    expect(screen.getByText("Corner plot")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Hide Updated plot from public" }));
    expect(screen.getByText("Hidden from public")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Admin logged in/i }));
    expect(screen.queryByRole("heading", { name: "Updated plot" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "New plot" })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Show Updated plot to public" }));
    cleanup();
    sessionStorage.clear();
    await renderPage();
    expect(await screen.findByRole("heading", { name: "Updated plot" })).toBeVisible();
    expect(screen.queryByRole("button", { name: /^Edit / })).not.toBeInTheDocument();

    cleanup();
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Delete Updated plot" }));
    expect(screen.getByRole("heading", { name: "Updated plot" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete Updated plot" }));
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("heading", { name: "Updated plot" })).not.toBeInTheDocument();
    cleanup();
    await renderPage();
    expect(await screen.findByRole("heading", { name: "No plots listed yet" })).toBeVisible();
  }, 15000);

  it("shows a storage error without adding a plot", async () => {
    sessionStorage.setItem("ksbaig_admin_session", "authenticated");
    await renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "New plot" }));
    fireEvent.change(screen.getByLabelText("Plot title"), { target: { value: "Plot" } });
    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Lahore" } });
    fireEvent.change(screen.getByLabelText("Price (PKR)"), { target: { value: "1000" } });
    fireEvent.change(screen.getByLabelText("Area (Marla)"), { target: { value: "3" } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage is full"); });
    fireEvent.click(screen.getByRole("button", { name: "Add plot" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Could not save the plot");
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
