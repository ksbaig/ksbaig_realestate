import { createFileRoute } from "@tanstack/react-router";
import { ConstructionPage } from "@/components/ConstructionPage";

export const Route = createFileRoute("/construction")({
  head: () => ({
    meta: [
      { title: "Construction Services | KSBaig Real Estate" },
      {
        name: "description",
        content:
          "Residential and commercial construction, renovation, interior design and architectural services in Al-Kabeer Town Phase 2, Lahore.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConstructionPage,
});
