import { createFileRoute } from "@tanstack/react-router";
import { RentListings } from "@/components/RentListings";

export const Route = createFileRoute("/rent")({
  head: () => ({
    meta: [
      { title: "Houses for Rent | KSBaig Real Estate" },
      {
        name: "description",
        content:
          "Explore the KSBaig Real Estate demo rental listings and inquire about homes to rent in Al-Kabeer Town Phase 2, Lahore.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RentListings,
});
