import { createFileRoute } from "@tanstack/react-router";
import { SaleListings } from "@/components/SaleListings";

export const Route = createFileRoute("/sale")({
  head: () => ({
    meta: [
      { title: "Houses for Sale | KS Big Real Estate" },
      {
        name: "description",
        content:
          "Explore the KS Big Real Estate demo sale listings and inquire about homes in Al-Kabeer Town Phase 2, Lahore.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SaleListings,
});
